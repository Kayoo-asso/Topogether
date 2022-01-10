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

export type StateUpdate<T> = T | ((prev: T) => T);
export type CleanupHelper = (cleanup: () => void) => void;

export interface QuarkOptions<T> {
    equal?: ((a: T, b: T) => boolean),
    name?: string,
}

export type EffectOptions = ImmediateEffectOptions | LazyEffectOptions;

export interface ImmediateEffectOptions {
    lazy?: false,
    watch?: DataNode[],
    persistent?: boolean,
    name?: string | undefined,
}

export interface LazyEffectOptions {
    lazy: true,
    // if no "watch" dependencies are passed, the effect will never execute
    watch: DataNode[],
    persistent?: boolean,
    name?: string | undefined,
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
    // 0 means clean or ready to execute (note: may need to separate the two)
    // > 0 means it's waiting for more confirmations
    // < 0 means a cycle was created
    // dirty count
    dirty: number,
    // update flag
    update: boolean, // TODO: replace by the sign bit of dirtyCount
    // Dependencies & dependency slots
    deps: DataNode[],
    depSlots: number[],
    // Observers and observer slots
    obs: Computation[],
    oSlots: number[],
    name?: string
}

// max signed 31-bit integer (optimized to SMI by JS engines)
const ONSTACK = 1073741823;

export const enum NodeType {
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
    // dirty count
    dirty: number,
    // update flag
    update: boolean, // TODO: remove by using the sign bit of dirtyCount instead
    deps: DataNode[],
    depSlots: number[],
    // constant dependencies
    // - 1 means the effect has been deleted
    cdeps: number,
    cleanup: (() => void)[] | null,
    name?: string
}

const DELETED_EFFECT = -1;

interface Scope {
    accessed: DataNode[],
    // null here means effects are not allowed
    cleanups: (() => void)[] | null,
    parent: Scope | undefined,
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

// TODO: make it framework agnostic, by allowing external integrations to set this function
let BatchUpdates = (work: () => void) => work();
export function setBatchUpdates(fn: (work: () => void) => void) {
    BatchUpdates = fn;
}

let CurrentScope: Scope | undefined = undefined;

const BatchIndices: number[] = [];
// we need two booleans to distinguish a running update batch & an external call to "batch",
// which just suspends writes to quarks until the end
let RunningBatch = false;

const PendingQuarks: QuarkNode<any>[] = [];
const PendingUpdates: StateUpdate<any>[] = [];

const ScheduledEffects: EffectNode[] = [];
let DeactivationCandidates: DerivationNode<any>[] = []

// === EXTERNAL API ===

export function trackContext<T>(work: () => T): [T, Scope] {
    CurrentScope = {
        accessed: [],
        cleanups: [],
        parent: CurrentScope
    };
    const result = work();
    const scope = CurrentScope;
    CurrentScope = scope.parent;
    return [result, scope];
}

export function untrack<T>(work: () => T): T {
    const saved = CurrentScope;
    CurrentScope = undefined;
    const result = work();
    CurrentScope = saved;
    return result;
}

const defaultEqual = <T>(a: T, b: T) => a === b;

export function quark<T>(value: T, options?: QuarkOptions<T>): Quark<T> {
    const q: QuarkNode<T> = {
        type: NodeType.Quark,
        value,
        equal: options?.equal ?? defaultEqual,
        obs: [],
        oSlots: [],
        name: options?.name
    };
    // TODO: would .bind() be noticeably faster?
    const read = () => readNode(q);
    read.set = (value: T) => writeNode(q, value);
    if (DEBUG) {
        (read as QuarkDebug<T>).node = q;
    }
    return read;
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
        dirty: 0,
        update: false,
        obs: [],
        oSlots: [],
        deps: [],
        depSlots: [],
        name: options?.name,
    };
    updateDerivation(d);
    // TODO: would .bind() be noticeably faster?
    const s = () => readNode(d);
    if (DEBUG) {
        (s as SignalDebug<T>).node = d;
    }
    return s;
}

const defaultEffectOptions: Required<Omit<EffectOptions, 'name'>> = {
    lazy: false,
    persistent: false,
    watch: []
}

export function effect(computation: (onCleanup: CleanupHelper) => void, options?: EffectOptions): Effect {
    const effect: EffectNode = {
        type: NodeType.Effect,
        fn: computation,
        deps: [],
        depSlots: [],
        cdeps: 0,
        dirty: 0,
        update: false,
        cleanup: null,
        name: options?.name,
    }
    const result = {
        dispose: () => cleanupEffect(effect, true),
    }

    const opts = {
        ...defaultEffectOptions,
        ...options
    };

    if (CurrentScope) {
        if (CurrentScope.cleanups && !opts.persistent) {
            CurrentScope.cleanups.push(result.dispose);
        } else {
            handleError("Quarky detected an attempt to create an effect within a derivation! This is not allowed: derivation should be pure functions.");
        }
    }

    if (opts.watch.length) {
        const deps = opts.watch;
        const slots = new Array(deps.length);
        for (let i = 0; i < deps.length; i++) {
            slots[i] = hookObserver(effect, deps[i], i);
        }
        effect.deps = deps as DataNode[];
        effect.depSlots = slots;
        effect.cdeps = deps.length;
    }

    if (!opts.lazy) {
        runEffect(effect);
    }

    if (DEBUG) {
        (result as EffectDebug).node = effect;
    }

    return result;
}

// Q: should transactions suspend derivation creations? (derivations are pure from Quarky's point of view)
// Q: should transactions suspend effect cleanups?
// Q: should transactions have their own scope?
export function batch(work: () => void) {
    RunningBatch = true;
    BatchIndices.push(PendingQuarks.length);
    work();
    BatchIndices.pop();
    processUpdates();
}

// === CORE ===

function readNode<T>(node: QuarkNode<T> | DerivationNode<T>): T {
    if (CurrentScope) {
        CurrentScope.accessed.push(node);
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
    if (node.type === NodeType.Derivation && node.obs.length === 0) {
        // necessary to detect cycles among potentially deactivated nodes
        if (node.dirty === ONSTACK) {
            // clean up the scope to recover the state
            handleError("Quarky detected a cycle!", node.name);
        }
        const saveDirtyCount = node.dirty;
        node.dirty = ONSTACK;
        updateDerivation(node);
        node.dirty = saveDirtyCount;
    }
    return node.value;
}

function writeNode<T>(node: QuarkNode<T>, update: StateUpdate<T>) {
    // TODO: check this again once we have a trackContext function
    if (CurrentScope && !CurrentScope.cleanups) {
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

function processUpdates() {
    RunningBatch = true;
    const start = BatchIndices.pop() ?? 0;
    let iterations = 0;
    // console.log("=== PROCESSING UPDATES ===");

    // The BatchUpdates function is
    BatchUpdates(() => {
        while (PendingQuarks.length > start || ScheduledEffects.length > 0) {
            if (iterations > MAX_ITERS) {
                handleError(`Runaway update cycle detected! (>${MAX_ITERS} iterations)`);
            }
            iterations += 1;
            // TODO: copy scheduled effects, in case one of the effects add to the list?
            const quarks = PendingQuarks.splice(start);
            const updates = PendingUpdates.splice(start);
            const changed: QuarkNode<any>[] = [];
            for (let i = 0; i < quarks.length; i++) {
                const q = quarks[i];
                const u = updates[i];
                // console.log(`Setting quark \"${q.name}\" to ${u}.\nObservers: ${q.obs}`);
                let newValue;
                if (typeof u === "function") {
                    newValue = u(q.value);
                } else {
                    newValue = u;
                }

                if (q.equal(q.value, newValue)) {
                    continue;
                }

                q.value = newValue;
                for (let j = 0; j < q.obs.length; j++) {
                    flagDirty(q.obs[j]);
                }
                changed.push(q);
            }

            for (let i = 0; i < changed.length; i++) {
                const q = changed[i];
                for (let j = 0; j < q.obs.length; j++) {
                    signalReady(q.obs[j], true);
                }
            }

            // Run all cleanups first, since effects that were scheduled to run may be cleaned up
            // by effects that were scheduled later
            const effects = ScheduledEffects.splice(0);
            for (let i = 0; i < effects.length; i++) {
                // cleaning up a deleted effect should not be a problem
                cleanupEffect(effects[i], false);
            }
            for (let i = 0; i < effects.length; i++) {
                // runEffect should stop early if the effect has already been deleted
                runEffect(effects[i]);
            }

        }
    });

    for (let i = 0; i < DeactivationCandidates.length; i++) {
        const d = DeactivationCandidates[i];
        if (d.obs.length > 0) continue;
        // console.log("Deactivating ", d);
        detachDependencies(d);
        d.depSlots = [];
    }
    DeactivationCandidates = [];

    RunningBatch = false;
}

// returns `true` if the value changed
function updateDerivation(node: DerivationNode<any>): boolean {
    // console.log(`Updating derivation ${node.name}`);
    const scope: Scope = {
        accessed: [],
        // effects are not allowed in a derivation
        cleanups: null,
        parent: CurrentScope
    };
    CurrentScope = scope;
    const next = node.fn();
    CurrentScope = scope.parent;

    if (node.obs.length > 0) {
        refreshDependencies(node, scope.accessed);
    } else {
        // TODO: remove once out of testing mode
        if (node.depSlots.length > 0) throw new Error("A derivation with no observers should not be using any dependency slots");
        node.deps = scope.accessed;
    }
    const prev = node.value;
    node.value = next;
    node.dirty = 0;
    return !node.equal(prev, next);
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
    // console.log(`Hooking observer \"${observer.name}\" to \"${dependency.name}\"`);
    // Dependencies should have been activated through the read call beforehand
    const usedSlot = dependency.obs.length;
    dependency.obs.push(observer);
    dependency.oSlots.push(slot);
    // check used slot first to avoid memory jump in case it's >0
    // Activate eagerly
    if (usedSlot === 0 && dependency.type === NodeType.Derivation) {
        activate(dependency);
    }
    return usedSlot;
}

function activate(node: DerivationNode<any>) {
    // TODO: remove once proper testing is done
    if (node.obs.length !== 1) throw new Error("Should not be calling activate on a derivation that had observers");
    // this means the node was not yet deactivated
    if (node.depSlots.length > 0) return;
    const slots = new Array(node.deps.length);
    for (let i = 0; i < slots.length; i++) {
        slots[i] = hookObserver(node, node.deps[i], i);
    }
    node.depSlots = slots;
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

function cleanupEffect(effect: EffectNode, deleting: boolean) {
    if (deleting) {
        detachDependencies(effect);
        effect.cdeps = DELETED_EFFECT;
    }
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
function flagDirty(node: Computation) {
    if (node.dirty === ONSTACK) {
        handleError("Quarky detected a cycle!", node.name);
    }
    node.dirty += 1;
    // console.log(`Flagging ${node.name} as dirty. dirtyCount = ${node.dirty}`);
    // only propagate the dirty flag if it's the first time this derivation has been dirtied
    if (node.type === NodeType.Derivation && node.dirty === 1) {
        node.dirty = ONSTACK;
        for (let i = 0; i < node.obs.length; i++) {
            const o = node.obs[i];
            flagDirty(o);
        }
        node.dirty = 1;
    }
}

function signalReady(node: Computation, shouldRecompute: boolean) {
    // As far as I understand it, if a cycle is created during an update, this case can be triggered (see tests)
    // It may be possible this error is hit without cycles as well
    if (node.dirty <= 0) {
        handleError("Something went wrong during Quarky's update propagation. This is likely due to a cycle.", node.name)
    }
    node.update ||= shouldRecompute;
    // console.log(`Signaling ready to ${node.name}. dirtyCount (before decrement): ${node.dirtyCount}`);
    if (--node.dirty === 0) {
        if (node.type === NodeType.Effect) {
            if (node.update) {
                ScheduledEffects.push(node);
                node.update = false;
            }
            return;
        }
        // TODO: batch derivation updates as well?
        const valueChanged = node.update && updateDerivation(node);
        node.update = false;
        for (let i = 0; i < node.obs.length; i++) {
            const o = node.obs[i];
            signalReady(o, valueChanged);
        }
    }
}

function runEffect(effect: EffectNode) {
    // console.log(`Running effect with dependencies: ${effect.deps.map(x => x.name)}\n. Nb of constant dependencies: ${effect.cdeps}`);
    if (effect.cdeps === DELETED_EFFECT) return;
    const scope: Scope = {
        accessed: effect.deps.slice(0, effect.cdeps),
        cleanups: [],
        parent: CurrentScope
    };
    CurrentScope = scope;
    batch(() => effect.fn(onCleanup));
    CurrentScope = scope.parent;

    effect.cleanup = scope.cleanups!.length !== 0
        ? scope.cleanups
        : null;

    // TODO: more optimal way to update dependencies, while taking into account constant dependencies?
    // Ideally, only one allocation for the slots
    refreshDependencies(effect, scope.accessed);
}

// should not be exposed outside effect functions
function onCleanup(cleanup: () => void) {
    const scope = CurrentScope!;
    if (!scope.cleanups) {
        scope.cleanups = [cleanup];
    } else {
        scope.cleanups.push(cleanup);
    }
}

function handleError(errorMsg: string, name?: string) {
    // not the best way, but I don't know how to recover the scope otherwise
    CurrentScope = undefined;
    let msg = errorMsg;
    if (name) msg += ` The problem was hit at quark \"${name}\".`;
    throw new Error(msg);
}
