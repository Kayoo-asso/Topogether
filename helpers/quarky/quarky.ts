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
export type CleanupHelper = (cleanup: (deleted: boolean) => void) => void;

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

// TODO: see if we can make all internal functions monomorphic, i.e. not use union types
// -> this should allow JS engine to optimise much more

// Optimisations:
// 1. Never change the shape of objects after creation
//    See: https://richardartoul.github.io/jekyll/update/2015/04/26/hidden-classes.html
// 2. All functions take exact types. Write functions as if you were writing C code with structs.

interface QuarkNode<T> {
    readonly type: NodeType.Quark,
    value: T,
    equal: (a: T, b: T) => boolean,
    lastEpoch: number,
    // Observers and observer slots
    obs: Set<Computation>,
    name: string | undefined,
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
    // Dependencies & dependency slots
    deps: Set<DataNode>,
    // Observers and observer slots
    obs: Set<Computation>,
    name: string | undefined
}

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
    scheduled: boolean,
    deleted: boolean,
    track: boolean,
    deps: Set<DataNode>,
    // constant dependencies (current use: observer effects. intended use: any effect that has dependencies that are not read)
    // - 1 means the effect has been deleted
    // cdeps: number,
    cleanup: ((deleted: boolean) => void)[] | null,
    name: string | undefined
}

const EFFECT_DELETED = -1;

interface Scope {
    accessed: Set<DataNode>,
    // null here means effects are not allowed
    cleanups: ((deleted: boolean) => void)[] | null,
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
let RunningBatch = false;

const PendingQuarks: QuarkNode<any>[] = [];
const PendingUpdates: StateUpdate<any>[] = [];

const ScheduledEffects: EffectNode[] = [];
let DeactivationCandidates: DerivationNode<any>[] = []

// === EXTERNAL API ===

export function untrack<T>(work: () => T): T {
    ScopeStack.push({ accessed: new Set(), cleanups: [] });
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
        obs: new Set(),
        name: options?.name
    };
    const read = () => readQuark(q);
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
        });
    }
    return q;
}

export function selectSignal<T>(): SelectSignalNullable<T>;
export function selectSignal<T>(initial: Signal<T>): SelectSignal<T>;
export function selectSignal<T>(initial?: Signal<T>): SelectSignal<T> | SelectSignalNullable<T> {
    const inner = quark<Signal<T> | undefined>(initial);
    const outer = () => {
        const selected = inner();
        return selected ? selected() : undefined;
    }
    outer.quark = inner;
    // it's necessary to wrap "selected" in a closure, otherwise the quark will think the inner signal
    // is a state update function and will execute it, instead of storing it as-is.
    outer.select = (selected: Signal<T> | undefined) => inner.set(() => selected)
    return outer as any;
}

export function selectQuark<T>(): SelectQuarkNullable<T>;
export function selectQuark<T>(initial: Quark<T>): SelectQuark<T>;
export function selectQuark<T>(initial?: Quark<T>): SelectQuark<T> | SelectQuarkNullable<T> {
    // TypeScript just struggles here, but selectSignal also works for SelectQuark
    return selectSignal(initial as any) as SelectQuark<T> | SelectQuarkNullable<T>;
}

export function derive<T>(computation: () => T, options?: QuarkOptions<T>): Signal<T> {
    const d: DerivationNode<T> = {
        type: NodeType.Derivation,
        value: undefined!,
        equal: options?.equal ?? defaultEqual,
        fn: computation,
        lastEpoch: -1,
        active: false,
        dirty: false,
        onStack: false,
        obs: new Set(),
        //   oSlots: [],
        deps: new Set(),
        //   depSlots: [],
        name: options?.name,
    };
    const s = () => readDerivation(d);
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
    deps: new Set(),
    //   depSlots: [],
    // cdeps: 0,
    scheduled: false,
    deleted: false,
    track: true,
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
        dispose: () => cleanupEffect(e, true)
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
        for (let i = 0; i < input.length; i++) {
            input[i] = signals[i]();
        }
        computation(signals, onCleanup);
    }
    const e = buildEffect(fn, options?.name);
    const result = {
        dispose: () => cleanupEffect(e, true)
    }
    if (options?.lazy) {
        const scope: Scope = { accessed: new Set(), cleanups: null };
        ScopeStack.push(scope);
        // we can do this in one pass, since each call to signals[i]() pushes one node on scope.accessed
        for (let i = 0; i < signals.length; i++) {
            signals[i]();
        }
        ScopeStack.pop();
        for (const d of scope.accessed) {
            hookObserver(e, d);
        }
        e.deps = scope.accessed;
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
    // throw new Error("TODO");
    const node: EffectNode = {
        type: NodeType.Effect,
        fn: computation,
        deps: new Set(),
        // cdeps: 0,
        scheduled: false,
        deleted: false,
        track: false,
        cleanup: null,
        name: undefined
    }
    // TODO: what do we do about nested effects created within that computation?
    // I don't think they should be cleaned up whenever the effect runs, that would be counterintuitive within React components
    return {
        watch<T>(computation: () => T): T {
            const scope: Scope = {
                accessed: new Set(),
                cleanups: []
            };
            ScopeStack.push(scope);
            const result = computation();
            ScopeStack.pop();
            refreshDependencies(node, scope.accessed);
            return result;
        },
        dispose: () => cleanupEffect(node, true)
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

function readQuark<T>(node: QuarkNode<T>): T {
    if (ScopeStack.length > 0) {
        ScopeStack[ScopeStack.length - 1].accessed.add(node);
    }
    return node.value;
}

function readDerivation<T>(node: DerivationNode<T>): T {
    if (ScopeStack.length > 0) {
        ScopeStack[ScopeStack.length - 1].accessed.add(node);
    }
    if (node.onStack) {
        // clean up the scope to recover the state
        handleError("Quarky detected a cycle!", node.name);
    }
    if (!node.active && node.lastEpoch < Epoch) {
        node.onStack = true;
        updateDerivation(node);
        node.onStack = false;
    }
    return node.value
}

function writeNode<T>(node: QuarkNode<T>, update: StateUpdate<T>) {
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

                for (const o of q.obs) {
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
                cleanupEffect(e, false);
                // allows rescheduling during execution phase
                e.scheduled = false;
            }
            // 
            for (let i = 0; i < effects.length; i++) {
                const e = effects[i];
                if (e.deleted) continue;
                // e does not use its passive dependencies
                if (updateChildren(e.deps)) {
                    runEffect(e);
                }
            }
            Epoch += 1;
        }
    });

    for (let i = 0; i < DeactivationCandidates.length; i++) {
        const d = DeactivationCandidates[i];
        if (d.obs.size > 0) continue;
        detachDependencies(d);
        d.active = false;
    }
    DeactivationCandidates = [];

    // only stop (RunningBatch = false) if there is no more work (BatchIndices.length === 0)
    RunningBatch = BatchIndices.length !== 0;
}

// returns `true` if the value changed
function updateDerivation(node: DerivationNode<any>): boolean {
    // console.log(`Updating derivation ${node.name}. Active: ${node.active}`);
    ScopeStack.push({
        accessed: new Set(),
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
    return updateChildren(node.deps) && updateDerivation(node);
}

function updateChildren(deps: Set<DataNode>): boolean {
    let somethingChanged = false;
    for(const d of deps) {
        if (d.type === NodeType.Derivation && d.dirty) {
            somethingChanged ||= propagateDown(d);
            d.dirty = false;
        } else if (d.lastEpoch === Epoch) {
            somethingChanged = true;
        }
    }
    return somethingChanged;
}
function refreshDependencies(node: Computation, accessed: Set<DataNode>) {
    const current = node.deps;
     for (const d of accessed) {
        if (!current.delete(d)) {
            hookObserver(node, d);
        }
    }
    for (const d of current) {
        unhookObserver(node, d);
    }
    node.deps = accessed;
}


// returns the slot that was used
function hookObserver(observer: Computation, dependency: DataNode) {
    dependency.obs.add(observer);
    if (dependency.type === NodeType.Derivation && dependency.obs.size === 1) {
        activate(dependency);
    }
}

function activate(node: DerivationNode<any>) {
    if (node.active) return;
    // console.log("Activating dependency");
    for (const dep of node.deps) {
        hookObserver(node, dep);
    }
    node.active = true;
}

// TODO: measure perf & memory vs using sets
// Not sure this is actually faster, due to a lot of jumps in memory
function unhookObserver(observer: Computation, dependency: DataNode) {
    dependency.obs.delete(observer);
    if (dependency.type === NodeType.Derivation && dependency.obs.size === 0) {
        DeactivationCandidates.push(dependency);
    }
}


function cleanupEffect(effect: EffectNode, deleted: boolean) {
    if (deleted) {
        detachDependencies(effect);
        effect.deleted = true;
        effect.deps.clear();
    }
    if (effect.cleanup) {
        // copy cleanups and set them to null right away, in case one of the cleanups leads to another cleanup of this same effect
        const cleanups = effect.cleanup;
        // when processing updates, we may clean an effect first, then delete it because its parent reruns
        // this avoids running the cleanups twice
        effect.cleanup = null;
        for (let i = 0; i < cleanups.length; i++) {
            cleanups[i](deleted);
        }
    }
    if (!RunningBatch && DeactivationCandidates.length > 0) {
        // in case of deactivations
        processUpdates();
    }
}

function detachDependencies(node: Computation) {
    for (const d of node.deps) {
        unhookObserver(node, d);
    }
    // clearing the dependency set should be done elsewhere (the set is actually kept for inactive derivations)
    node.deps.clear();
}

// depth-first search, to detect cycles
function flagDirty(node: DerivationNode<any>) {
    if (node.onStack) handleError("Quarky detected a cycle!", node.name);
    if (!node.dirty) {
        node.onStack = true;
        for (const o of node.obs) {
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
        // todo: handle cdeps
        accessed: new Set(),
        cleanups: [],
    })
    // effect.fn(onCleanup);
    batch(() => effect.fn(onCleanup));
    const scope = ScopeStack.pop()!;

    effect.cleanup = scope.cleanups!.length !== 0
        ? scope.cleanups
        : null;

    // in case the effect deleted itself during execution
    if (effect.deleted) {
        // run any cleanups that may have been registered after deletion
        cleanupEffect(effect, true);
    } else if(effect.track) {
        refreshDependencies(effect, scope.accessed);
    }
}

// should not be exposed outside effect functions
function onCleanup(cleanup: (deleted: boolean) => void) {
    const scope = ScopeStack[ScopeStack.length - 1];
    scope.cleanups!.push(cleanup);
}

function handleError(errorMsg: string, name?: string) {
    // not the best way, but I don't know how to recover the scope otherwise
    ScopeStack.pop();
    let msg = errorMsg;
    if (name) msg += ` The problem was hit at quark "${name}".`;
    throw new Error(msg);
}
