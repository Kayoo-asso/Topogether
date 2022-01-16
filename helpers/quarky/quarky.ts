// === EXTERNAL API ===

// The interface common to Quarks and Signals
// This is simply a function that returns the current value of the signal
// A computed signal (= derived from other signals) without any active observers
// is removed from the auto-update system. Its value will only be updated upon the next read.
// An active observer can be an effect, or another active signal.

export interface Signal<T> {
    (): T,
};

// Quarks contain the data of the application
export interface Quark<T> extends Signal<T> {
    set(value: StateUpdate<T>): void,
};

// SelectQuarks are useful when picking a quark to use somewhere else
// They are a handy wrapper around a Quark<Quark<T>> or Quark<Quark<T> | undefined>
export interface SelectQuark<T> {
    (): T,
    quark(): Quark<T>,
    select(value: Quark<T>): void,
}

export interface SelectQuarkNullable<T> {
    (): T | undefined,
    quark(): Quark<T> | undefined,
    select(value: Quark<T> | undefined): void,
}

// SelectSignals are the readonly version of SelectQuarks
export interface SelectSignal<T> {
    (): T,
    quark(): Signal<T>,
    select(value: Signal<T>): void,
}

export interface SelectSignalNullable<T> {
    (): T | undefined,
    quark(): Signal<T> | undefined,
    select(value: Signal<T> | undefined): void,
}

// Effects keep signals activated and are rerun whenever one of their dependencies changes
export interface Effect {
    dispose(): void,
};

export interface ObserverEffect extends Effect {
    watch<T>(computation: () => T): T
}

export type ValueOrWrappedFunction<T> = T extends Function ? () => T : T;
export type StateUpdate<T> = ValueOrWrappedFunction<T> | ((prev: T) => T);
export type CleanupHelper = (cleanup: () => void) => void;

export interface QuarkOptions<T> {
    equal?: ((a: T, b: T) => boolean),
    name?: string,
}

export interface EffectOptions {
    persistent?: boolean,
    name?: string,
}

export interface ExplicitEffectOptions {
    lazy?: boolean,
    persistent?: boolean,
    name?: string | undefined,
}

export type SignalValue<T> = T extends Signal<infer U> ? U : never;
export type EvaluatedDeps<T extends (Array<Signal<any>> | ReadonlyArray<Signal<any>>)> = {
    [K in keyof T]: SignalValue<T[K]>;
}

// === TYPES ===

// import ReactDOM from "react-dom";

// TODO: see if we can make all internal functions monomorphic, i.e. not use union types
// -> this should allow JS engine to optimise much more
// IDEA: implement light subscribers that listen to only a single quark
// TODO: optimise the reactivation process, so that the context tracks whether it is detached or not
// and the activation happens on read

// Optimisation note: never change the shape of objects after creation
// See: https://richardartoul.github.io/jekyll/update/2015/04/26/hidden-classes.html

interface QuarkNode<T> {
    readonly type: NodeType.Quark,
    value: T,
    equal: (a: T, b: T) => boolean,
    lastEpoch: number,
    // Observers and observer slots
    obs: Computation[],
    oSlots: number[],
    name?: string,
}

interface DerivationNode<T> {
    readonly type: NodeType.Derivation,
    value: T,
    equal: (a: T, b: T) => boolean,
    readonly fn: () => T,
    lastEpoch: number,
    onStack: boolean,
    dirty: boolean,
    active: boolean,
    // status: DerivationStatus,
    // 0 means clean or ready to execute (note: may need to separate the two)
    // > 0 means it's waiting for more confirmations
    // < 0 means a cycle was created
    // dirty count
    // dirty: number,
    // update flag
    // update: boolean, // can't replace with the sign bit of dirty, since dirty may go <0 during propagation if there's a cycle
    // Dependencies & dependency slots
    deps: DataNode[],
    depSlots: number[],
    // Observers and observer slots
    obs: Computation[],
    oSlots: number[],
    name?: string
}

// const enum DerivationStatus {
//     Clean,
//     Dirty,
//     Inactive,
//     OnStack,
// }

const enum NodeType {
    Quark,
    Derivation,
    Effect
}

// Creating an effect within a derivation WILL throw.
// Derivations are meant to be pure functions.
// This is also necessary due to how memory management works: derivations are automatically deactivated and garbage collected,
// and effects created under a derivation would have to be deactivated at the same time.
// Effects have to be cleaned up manually, if not created under another effect.
// TODO: test what happens when creating an effect with a dependency that is both explicit + in the computation

interface EffectNode {
    readonly type: NodeType.Effect,
    readonly fn: (onCleanup: CleanupHelper) => void,
    // can be either the index into the array of scheduled computations or a status value (if < 0)
    // status: NodeStatus,
    // dirty count
    // dirty: number,
    // update flag
    // update: boolean, // TODO: remove by using the sign bit of dirtyCount instead
    scheduled: boolean,
    deps: DataNode[],
    depSlots: number[],
    // constant dependencies
    // - 1 means the effect has been deleted
    cdeps: number,
    cleanup: (() => void)[] | null,
    name?: string
}

const EFFECT_DELETED = -1;

interface Scope {
    accessed: DataNode[],
    // null here means effects are not allowed
    cleanups: (() => void)[] | null,
}

type DataNode = QuarkNode<any> | DerivationNode<any>;
type Computation = DerivationNode<any> | EffectNode;

// === GLOBAL CONTEXT ===

// TODO: verify that the associated code is stripped out in production build
const DEBUG = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

export interface QuarkDebug<T> extends Quark<T> {
    node: QuarkNode<T>
}

export interface SignalDebug<T> extends Signal<T> {
    node: DerivationNode<T>
}

export interface EffectDebug extends Effect {
    node: EffectNode
}

let BatchUpdates = (work: () => void) => work();
// allows Quarky's core to be framework-agnostic
export function setBatchUpdates(fn: (work: () => void) => void) {
    BatchUpdates = fn;
}

let Epoch = 0;
const ScopeStack: Scope[] = [];

const BatchIndices: number[] = [];
// we need two booleans to distinguish a running update batch & an external call to "batch",
// which just suspends writes to quarks until the end
let RunningBatch = false;

const PendingQuarks: QuarkNode<any>[] = [];
const PendingUpdates: StateUpdate<any>[] = [];

const ScheduledEffects: EffectNode[] = [];
let DeactivationCandidates: DerivationNode<any>[] = []

// === EXTERNAL API ===

export function untrack<T>(work: () => T): T {

    ScopeStack.push({ accessed: [], cleanups: [] });
    const result = work();
    ScopeStack.pop();
    return result;
}

const defaultEqual = <T>(a: T, b: T) => a === b;

export function quark<T>(value: T, options?: QuarkOptions<T>): Quark<T> {
    const q: QuarkNode<T> = {
        type: NodeType.Quark,
        value,
        equal: options?.equal ?? defaultEqual,
        lastEpoch: Epoch,
        obs: [],
        oSlots: [],
        name: options?.name
    };
    // TODO: would .bind() be noticeably faster?
    const read = () => readNode(q);
    read.set = (value: StateUpdate<T>) => writeNode(q, value);
    if (DEBUG) {
        (read as QuarkDebug<T>).node = q;
    }
    return read;
}

export type FocusQuarkOptions<U> =
    { strictUpdates?: false } |
    {
        strictUpdates?: true,
        equal?: ((a: U, b: U) => boolean),
        name?: string,
    }

export function focusQuark<T, U>(
    quark: Quark<T>,
    focus: (value: T) => U,
    write: (value: T, modif: U) => T,
    options?: FocusQuarkOptions<U>
): Quark<U> {
    let q = (() => focus(quark())) as Quark<U>;
    if (options?.strictUpdates) {
        q = derive(q, { equal: options.equal, name: options.name }) as Quark<U>
    }
    // use this form of Quark.set to recover the previous value without reading the quark
    q.set = (u: StateUpdate<U>) => {
        quark.set((current: T) => {
            // TypeScript massaging: if u is a function, we execute it
            let newValue: U = u as U;
            if (typeof u === "function") {
                newValue = (u as (prev: U) => U)(focus(current))
            }
            return write(current, newValue);
        })
    }
    return q;
}

export function selectSignal<T>(): SelectSignalNullable<T>;
export function selectSignal<T>(initial: Signal<T>): SelectSignal<T>;
export function selectSignal<T>(initial?: Signal<T>): SelectSignal<T> | SelectSignalNullable<T> {
    const inner = quark<Signal<T> | undefined>(initial);
    const outer = () => {
        const selected = inner();
        // console.log("Reading the inner value of a SelectQuark. selected = ", selected);
        return selected ? selected() : undefined;
    }
    outer.quark = inner;
    // necessary, otherwise the quark will think the inner signal is a state update and
    // will execute it, instead of storing it as-is.
    outer.select = (selected: Signal<T> | undefined) => inner.set(() => selected);
    return outer as any;
}

export function selectQuark<T>(): SelectQuarkNullable<T>;
export function selectQuark<T>(initial: Quark<T>): SelectQuark<T>;
export function selectQuark<T>(initial?: Quark<T>): SelectQuark<T> | SelectQuarkNullable<T> {
    // TypeScript just struggles here
    return selectSignal(initial as any) as SelectQuark<T> | SelectQuarkNullable<T>;
}

// TODO: allow derivations that receive the previous value as argument,
// but require an initial value to be provided in the options
export function derive<T>(computation: () => T, options?: QuarkOptions<T>): Signal<T> {
    // the value will be computed with updateDerivation
    const d: DerivationNode<T> = {
        type: NodeType.Derivation,
        value: undefined!,
        equal: options?.equal ?? defaultEqual,
        fn: computation,
        lastEpoch: -1,
        active: false,
        dirty: false,
        onStack: false,
        // status: DerivationStatus.Inactive,
        // dirty: INACTIVE,
        // update: false,
        obs: [],
        oSlots: [],
        deps: [],
        depSlots: [],
        name: options?.name,
    };
    // updateDerivation(d);
    // TODO: would .bind() be noticeably faster?
    const s = () => readNode(d);
    if (DEBUG) {
        (s as SignalDebug<T>).node = d;
    }
    return s;
}

export function effect<T extends Signal<any>[] | readonly Signal<any>[]>(deps: T, computation: (deps: EvaluatedDeps<T>, onCleanup: CleanupHelper) => void, options?: ExplicitEffectOptions): Effect;
export function effect(computation: (onCleanup: CleanupHelper) => void, options?: EffectOptions): Effect;
export function effect(arg1: any, arg2?: any, arg3?: any): Effect {
    if (typeof arg1 === "function") {
        return simpleEffect(arg1, arg2);
    } else {
        return explicitEffect(arg1, arg2, arg3);
    }
}

// 2 helpers to reduce code duplication between simpleEffect & explicitEffect
const buildEffect = (fn: (onCleanup: CleanupHelper) => void, name?: string): EffectNode => ({
    type: NodeType.Effect,
    fn,
    deps: [],
    depSlots: [],
    cdeps: 0,
    scheduled: false,
    // dirty: 0,
    // update: false,
    cleanup: null,
    name
});

function registerEffect(dispose: () => void, persistent: boolean | undefined) {
    if (ScopeStack.length > 0) {
        const scope = ScopeStack[ScopeStack.length - 1];
        if (!scope.cleanups) {
            handleError("Quarky detected an attempt to create an effect within a derivation! This is not allowed: derivation should be pure functions.");
        }
        if (!persistent) {
            scope.cleanups!.push(dispose);
        }
    }
}

function simpleEffect(fn: (onCleanup: CleanupHelper) => void, options?: EffectOptions): Effect {
    const e = buildEffect(fn, options?.name);
    const result = {
        dispose: () => deleteEFfect(e)
    }
    registerEffect(result.dispose, options?.persistent);

    runEffect(e);
    if (DEBUG) {
        (result as EffectDebug).node = e;
    }
    return result;
}

function explicitEffect(signals: any[], computation: (deps: any[], onCleanup: CleanupHelper) => void, options?: ExplicitEffectOptions): Effect {
    const fn = () => {
        const input = new Array(signals.length);
        for (var i = 0; i < input.length; i++) {
            input[i] = signals[i]();
        }
        computation(signals, onCleanup);
    }
    const e = buildEffect(fn, options?.name);
    const result = {
        dispose: () => deleteEFfect(e)
    }
    if (options?.lazy) {
        const slots = new Array(signals.length);
        const scope: Scope = { accessed: [], cleanups: null };
        ScopeStack.push(scope);
        // we can do this in one pass, since each call to signals[i]() pushes one node on scope.accessed
        for (var i = 0; i < signals.length; i++) {
            signals[i]();
            slots[i] = hookObserver(e, scope.accessed[i], i);
        }
        ScopeStack.pop()!;
        e.deps = scope.accessed;
        e.depSlots = slots;
    } else {
        runEffect(e);
    }
    registerEffect(result.dispose, options?.persistent);
    if (DEBUG) {
        (result as EffectDebug).node = e;
    }
    return result;
}

// TODO: effect options
export function observerEffect(computation: (onCleanup: CleanupHelper) => void): ObserverEffect {
    const node: EffectNode = {
        type: NodeType.Effect,
        fn: computation,
        deps: [],
        depSlots: [],
        cdeps: 0,
        scheduled: false,
        // dirty: 0,
        // update: false,
        cleanup: null,
    }
    // TODO: what do we do about nested effects created within that computation?
    // I don't think they should be cleaned up whenever the effect runs, that would be counterintuitive within React components
    const watch = <T>(computation: () => T): T => {
        ScopeStack.push({
            accessed: [],
            cleanups: [],
        });
        const result = computation();
        const scope = ScopeStack.pop()!;
        node.cdeps = scope.accessed.length;
        refreshDependencies(node, scope.accessed);
        return result;
    }
    return {
        watch,
        dispose: () => deleteEFfect(node)
    };
}

// Q: should batches have their own scope?
export function batch<T>(work: () => T): T {
    RunningBatch = true;
    BatchIndices.push(PendingQuarks.length);
    const output = work();
    processUpdates();
    return output;
}

// === CORE ===

function readNode<T>(node: QuarkNode<T> | DerivationNode<T>): T {
    if (ScopeStack.length > 0) {
        ScopeStack[ScopeStack.length - 1].accessed.push(node);
    }
    // console.log("Reading node " + node.name + ". Scope is: ", CurrentScope);
    // Check for updates - allows for lazy derivations & ensures glitch-free values even w/ concurrency (I think)
    // TODO: check again when we have lazy derivations / concurrency
    // Right now, it assumes the derivation can't be dirty, so it only checks if it is detached
    // TODO: should we activate the derivation here by updating + refreshing dependencies, if a scope exists?
    // (if the read is tracking)
    // Two cases for a scope : within a derivation or within an effect, both of which create an observer
    // TODO: should we add back a status tag on the derivation for fast checking?
    // -> probably faster than going to node.o.length

    // node.dirty < 0 means either INACTIVE or ONSTACK
    if (node.type === NodeType.Derivation) {
        // necessary to detect cycles among potentially deactivated nodes
        if (node.onStack) {
            // clean up the scope to recover the state
            handleError("Quarky detected a cycle!", node.name);
        }
        if (!node.active && node.lastEpoch < Epoch) {
            node.onStack = true;
            updateDerivation(node);
            node.onStack = false;
        }
    }
    return node.value;
}

function writeNode<T>(node: QuarkNode<T>, update: StateUpdate<T>) {
    // TODO: check this again once we have a trackContext function
    if (ScopeStack.length > 0 && !ScopeStack[ScopeStack.length - 1].cleanups) {
        console.error("Quarky detected an attempt to set a value in a derivation! This is not allowed and will be ignored");
        return;
    }

    // Slightly more work for the non-batching case, but this helps centralize the logic
    PendingQuarks.push(node);
    PendingUpdates.push(update);
    if (!RunningBatch) {
        processUpdates();
    }
}

const MAX_ITERS = 500;

// The nice part about Quarky's update model is that effects provide a natural endpoint
// That means we can update everything
function processUpdates() {
    RunningBatch = true;
    const start = BatchIndices.pop() ?? 0;
    let iterations = 0;

    // The BatchUpdates function is
    BatchUpdates(() => {
        while (PendingQuarks.length > start || ScheduledEffects.length > 0) {
            if (iterations > MAX_ITERS) {
                handleError(`Runaway update cycle detected! (>${MAX_ITERS} iterations)`);
            }
            iterations += 1;
            const quarks = PendingQuarks.splice(start);
            const updates = PendingUpdates.splice(start);
            for (let i = 0; i < quarks.length; i++) {
                const q = quarks[i];
                const u = updates[i];
                let prevValue = q.value;
                // still update the value inside the quark, in case it's different but a custom equality function is there to stop propagation
                if (typeof u === "function") {
                    q.value = u(q.value);
                } else {
                    q.value = u;
                }

                if (q.equal(prevValue, q.value)) continue;

                q.lastEpoch = Epoch;

                for (let j = 0; j < q.obs.length; j++) {
                    const o = q.obs[j];
                    if (o.type === NodeType.Effect) scheduleEffect(o);
                    else flagDirty(o);
                }
            }

            // Run all cleanups first, since effects that were scheduled to run may be cleaned up
            // by effects that were scheduled later
            const effects = ScheduledEffects.splice(0);
            for (let i = 0; i < effects.length; i++) {
                // cleaning up a deleted effect should not be a problem
                const e = effects[i];
                cleanupEffect(e);
                // allows rescheduling during execution phase
                e.scheduled = false; 
            }
            // 
            for (let i = 0; i < effects.length; i++) {
                const e = effects[i];
                if (e.cdeps === EFFECT_DELETED) continue;
                // e does not use its passive dependencies
                if (updateChildren(e)) {
                    runEffect(e);
                }
            }
            Epoch += 1;
        }
    });

    for (let i = 0; i < DeactivationCandidates.length; i++) {
        const d = DeactivationCandidates[i];
        if (d.obs.length > 0) continue;
        detachDependencies(d);
        d.active = false;
        d.depSlots = [];
    }
    DeactivationCandidates = [];

    // only stop (RunningBatch = false) if there is no more work (BatchIndices.length === 0)
    RunningBatch = BatchIndices.length !== 0;
}

// returns `true` if the value changed
function updateDerivation(node: DerivationNode<any>): boolean {
    // console.log(`Updating derivation ${node.name}. Active: ${node.active}`);
    ScopeStack.push({
        accessed: [],
        // effects are not allowed within a derivation
        cleanups: null
    });
    const prev = node.value;
    node.value = node.fn();
    const scope = ScopeStack.pop()!;

    if (node.active) {
        refreshDependencies(node, scope.accessed);
        const somethingChanged = !node.equal(prev, node.value);
        if (somethingChanged) node.lastEpoch = Epoch;
        return somethingChanged;
    } else {
        // TODO: remove once out of testing mode
        if (node.depSlots.length > 0) throw new Error("An inactive derivation should not be using any dependency slots");
        node.deps = scope.accessed;
        // this allows us to skip updates for reads to this inactive derivation in the same epoch
        // this approach only has an impact on update propagation if a deactivated node is activated again and keeps the same value
        // TODO: should we separate lastRead and lastUpdate?
        node.lastEpoch = Epoch;
        return true;
    }
}

function propagateDown(node: DerivationNode<any>): boolean {
    // only update the derivation if one of the children has changed 
    // and only send a signal upward if the value changed with the update
    return updateChildren(node) && updateDerivation(node);
}

function updateChildren(node: Computation): boolean {
    let somethingChanged = false;
    for (let i = 0; i < node.deps.length; i++) {
        const d = node.deps[i];
        if (d.type === NodeType.Derivation && d.dirty) {
            somethingChanged ||= propagateDown(d);
            d.dirty = false;
        } else if (d.lastEpoch === Epoch) {
            somethingChanged = true;
        }
    }
    return somethingChanged;
}

function refreshDependencies(node: DerivationNode<any> | EffectNode, accessed: DataNode[]) {
    // We go over both arrays at once, since it's likely most dependencies will be the same
    const current = node.deps;
    const currentSlots = node.depSlots;
    // copy to local for fast access
    const currentLength = current.length;
    const accessedLength = accessed.length;

    const commonLength = Math.min(currentLength, accessedLength);
    const slots = new Array(accessedLength);

    // By defining i outside the loop, we can keep track of its final value
    // This allows us to handle the case where `start` may be > to `length`,
    // by skipping the next 2 loops
    let i = 0;
    for (; i < commonLength; i++) {
        const before = current[i];
        const after = accessed[i];
        // fast path
        if (before === after) {
            slots[i] = currentSlots[i];
            continue;
        }
        // Unregister from before
        unhookObserver(node, before, currentSlots[i]);

        slots[i] = hookObserver(node, after, i);
    }
    // at most one loop runs
    for (; i < currentLength; i++) {
        unhookObserver(node, current[i], currentSlots[i]);
    }
    for (; i < accessedLength; i++) {
        slots[i] = hookObserver(node, accessed[i], i);
    }

    node.deps = accessed;
    node.depSlots = slots;
}

// returns the slot that was used
function hookObserver(observer: Computation, dependency: DataNode, slot: number): number {
    // console.log(`Hooking observer \"${observer.name}\" to \"${dependency.name}\". Existing observers: ${dependency.obs.length}`);
    // Dependencies should have been activated through the read call beforehand
    const usedSlot = dependency.obs.push(observer) - 1;
    dependency.oSlots.push(slot);
    // check used slot first to avoid memory jump in case it's >0
    // Activate eagerly
    if (usedSlot === 0 && dependency.type === NodeType.Derivation) {
        activate(dependency);
    }
    return usedSlot;
}

function activate(node: DerivationNode<any>) {
    // console.log("Activating dependency");
    // TODO: remove once proper testing is done
    if (node.obs.length !== 1) throw new Error("Should not be calling activate on a derivation that had observers");
    // this means the node was not yet deactivated
    if (node.depSlots.length > 0) return;
    const slots = new Array(node.deps.length);
    for (let i = 0; i < slots.length; i++) {
        slots[i] = hookObserver(node, node.deps[i], i);
    }
    node.depSlots = slots;
    node.active = true;
}

// TODO: measure perf & memory vs using sets
// Not sure this is actually faster, due to a lot of jumps in memory
function unhookObserver(observer: Computation, dependency: DataNode, slot: number) {
    // console.log(`Unhooking observer \"${observer.name}\" from \"${dependency.name}\"`)
    const lastObserver = dependency.obs.pop()!;
    const lastObserverSlot = dependency.oSlots.pop()!;
    if (lastObserver !== observer) {
        dependency.obs[slot] = lastObserver;
        dependency.oSlots[slot] = lastObserverSlot;
        lastObserver.depSlots[lastObserverSlot] = slot;
    }
    // only process deactivation candidates at the end, in case they get reactivated
    if (dependency.obs.length === 0 && dependency.type === NodeType.Derivation) {
        // console.log(`Pushing ${dependency.name} onto deactivation candidates`)
        DeactivationCandidates.push(dependency);
    }
}

function deleteEFfect(effect: EffectNode) {
    detachDependencies(effect);
    effect.cdeps = EFFECT_DELETED;
    effect.deps = [];
    effect.depSlots = [];
    cleanupEffect(effect);
}

function cleanupEffect(effect: EffectNode) {
    if (effect.cleanup) {
        for (let i = 0; i < effect.cleanup.length; i++) {
            effect.cleanup[i]();
        }
        // when processing updates, we may clean an effect first, then delete it because its parent reruns
        // this avoids running the cleanups twice
        effect.cleanup = null;
    }
    if (!RunningBatch) {
        // in case of deactivations
        processUpdates();
    }
}

function detachDependencies(node: Computation) {
    const dependencies = node.deps;
    const dependencySlots = node.depSlots;
    for (let i = 0; i < dependencies.length; i++) {
        const dep = dependencies[i];
        unhookObserver(node, dep, dependencySlots[i]);
    }
    // updating the dependency arrays should be done elsewhere, for efficiency reasons
}

// depth-first search, to detect cycles
function flagDirty(node: DerivationNode<any>) {
    if (node.onStack) handleError("Quarky detected a cycle!", node.name);
    if (!node.dirty) {
        node.onStack = true;
        for (let i = 0; i < node.obs.length; i++) {
            const o = node.obs[i];
            if (o.type === NodeType.Effect) scheduleEffect(o);
            else flagDirty(o);
        }
        node.onStack = false;
        node.dirty = true;
    }
}

const scheduleEffect = (node: EffectNode) => {
    if (!node.scheduled) {
        node.scheduled = true;
        ScheduledEffects.push(node);
    }
}

function runEffect(effect: EffectNode) {
    // console.log(`Running effect with dependencies: ${effect.deps.map(x => x.name)}\n. Nb of constant dependencies: ${effect.cdeps}`);
    // if (effect.cdeps === EFFECT_DELETED) return;

    ScopeStack.push({
        accessed: effect.deps.slice(0, effect.cdeps),
        cleanups: [],
    })
    batch(() => effect.fn(onCleanup));
    const scope = ScopeStack.pop()!;

    effect.cleanup = scope.cleanups!.length !== 0
        ? scope.cleanups
        : null;

    // in case the effect deleted itself during execution
    if (effect.cdeps === EFFECT_DELETED) {
        // run any cleanups that may have been registered after deletion
        cleanupEffect(effect); 
    } else {
        refreshDependencies(effect, scope.accessed);
    }
}

// should not be exposed outside effect functions
function onCleanup(cleanup: () => void) {
    const scope = ScopeStack[ScopeStack.length - 1];
    scope.cleanups!.push(cleanup);
}

function handleError(errorMsg: string, name?: string) {
    // not the best way, but I don't know how to recover the scope otherwise
    ScopeStack.pop();
    let msg = errorMsg;
    if (name) msg += ` The problem was hit at quark \"${name}\".`;
    throw new Error(msg);
}
