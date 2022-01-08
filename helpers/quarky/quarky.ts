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
    lazy: false,
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
    children: EffectNode[] | null,
    clean: (() => void)[] | null,
    name?: string
}

const DELETED_EFFECT = -1;

interface Scope {
    accessed: DataNode[],
    // null here means effects are not allowed
    effects: EffectNode[] | null,
    cleanups: (() => void)[] | null,
    parent: Scope | undefined,
}

type DataNode = QuarkNode<any> | DerivationNode<any>;
type Computation = DerivationNode<any> | EffectNode;

// === GLOBAL CONTEXT ===
let CurrentScope: Scope | undefined = undefined;

let PendingQuarks: QuarkNode<any>[] = [];
let PendingUpdates: StateUpdate<any>[] = [];
// let IsBatching = false;
let BatchIndices: number[] = [];

let ScheduledEffects: EffectNode[] = [];

// === EXTERNAL API ===
// Due to the phantom marker on external types

// export function read<T>(node: Quark<T> | Derivation<T>): T {
//     return read__internal(
//         node as QuarkNode<T> | DerivationNode<T>,
//         true // register
//     );
// }

// export function peek<T>(node: Quark<T> | Derivation<T>): T {
//     return read__internal(
//         node as QuarkNode<T> | DerivationNode<T>,
//         false // don't register
//     );
// }

export function trackContext<T>(work: () => T): [T, Scope] {
    CurrentScope = {
        accessed: [],
        effects: [],
        cleanups: null,
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

export function setQuark<T>(quark: Quark<T>, update: StateUpdate<T>) {
    quark.set(update);
}

function writeNode<T>(node: QuarkNode<T>, update: StateUpdate<T>) {
    // TODO: check this again once we have a trackContext function
    if (CurrentScope && ! CurrentScope.effects) {
        console.error("Quarky detected an attempt to set a value in a derivation! This is not allowed and will be ignored");
        return;
    }

    // Slightly more work for the non-batching case, but this helps centralize the logic
    PendingQuarks.push(node);
    PendingUpdates.push(update);
    if (BatchIndices.length === 0) {
        processUpdates();
    }
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
    return read;
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
    const d: DerivationNode<T> =  {
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
    return () => readNode(d);
}

export function effect(computation: (onCleanup: CleanupHelper) => void, options?: EffectOptions): Effect {
    if (CurrentScope && !CurrentScope.effects) {
        handleError("Quarky detected an attempt to create an effect within a derivation! This is not allowed: derivation should be pure functions.");
    }
    const effect: EffectNode = {
        type: NodeType.Effect,
        fn: computation,
        deps: [],
        depSlots: [],
        cdeps: 0,
        dirty: 0,
        update: false,
        children: null,
        clean: null,
        name: options?.name,
    }
    if (options?.watch?.length) {
        const deps = options.watch;
        const slots = new Array(deps.length);
        for (let i = 0; i < deps.length; i++) {
            slots[i] = hookObserver(effect, deps[i], i);
        }
        effect.deps = deps as DataNode[];
        effect.depSlots = slots;
        effect.cdeps = deps.length;
    }

    if (CurrentScope && !options?.persistent) {
        // console.log(`Pushing effect \"${effect.name}\" onto the scope`);
        CurrentScope.effects!.push(effect);
    }

    if (!options?.lazy) {
        if (BatchIndices.length > 0) {
            ScheduledEffects.push(effect);
        } else {
            runEffect(effect);
        }
    }
    return {
        dispose: () => cleanupEffect(effect, true)
    };
}

// Q: should transactions suspend derivation creations? (derivations are pure from Quarky's point of view)
// Q: should transactions suspend effect cleanups?
// Q: should transactions have their own scope?
export function batch(work: () => void) {
    BatchIndices.push(PendingQuarks.length);
    work();
    BatchIndices.pop();
    processUpdates();
}

// export function cleanupEffect(effect: Effect) {
//     cleanupEffect__internal(effect as EffectNode, true);
// }

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


function processUpdates() {
    const skip = new Array(PendingQuarks.length);
    for (let i = 0; i < PendingQuarks.length; i++) {
        const q = PendingQuarks[i];
        const u = PendingUpdates[i];
        console.log(`Setting quark \"${q.name}\" to ${u}.\nObservers: ${q.obs}`);
        let newValue;
        if (typeof u === "function") {
            newValue = u(q.value);
        } else {
            newValue = u;
        }

        if (q.equal(q.value, newValue)) {
            console.log("Skipping update to quark " + q.name);
            skip[i] = true;
            continue;
        }

        q.value = newValue;
        for (let j = 0; j < q.obs.length; j++) {
            const o = q.obs[j];
            flagDirty(o);
        }
    }

    for (let i = 0; i < PendingQuarks.length; i++) {
        if (skip[i]) continue;

        const q = PendingQuarks[i];
        for (let j = 0; j < q.obs.length; j++) {
            const o = q.obs[j];
            signalReady(o, true);
        }
    }

    // ReactDOM.unstable_batchedUpdates(() => {
        // Children effects may have been scheduled before their parents, so we have
        // to run all cleanups first
        for (let i = 0; i < ScheduledEffects.length; i++) {
            const e = ScheduledEffects[i];
            if (e.cdeps === DELETED_EFFECT) continue;
            cleanupEffect(ScheduledEffects[i], false);
        }
        for (let i = 0; i < ScheduledEffects.length; i++) {
            const e = ScheduledEffects[i];
            if (e.cdeps === DELETED_EFFECT) continue;
            runEffect(e);
        }
        PendingQuarks = [];
        PendingUpdates = [];
        ScheduledEffects = [];
    // });

}

// returns `true` if the value changed
function updateDerivation(node: DerivationNode<any>): boolean {
    // console.log(`Updating derivation ${node.name}`);
    const scope = {
        accessed: [],
        // effects are not allowed in a derivation
        effects: null,
        cleanups: null,
        parent: CurrentScope
    };
    CurrentScope = scope;
    const next = node.fn();
    CurrentScope = scope.parent;

    // TODO: make it conditional, to avoid attaching detached nodes upon read
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

    // Do it in a second pass, to avoid "dependency thrashing"
    // Ex: a computation keeps the same 20 dependencies, but uses a 21st dependency right at the beginning,
    // exactly every two runs. Those 20 dependencies are derivations only kept alive for this computation.
    // If we attempt cleanup during the first pass, we'll end up doing unhook -> deactivate -> hook -> activate
    // for each of them, possibly chaining whole deactivation chains.
    for (let i = 0; i < currentLength; i++) {
        attemptCleanup(current[i]);
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
    if (usedSlot === 0 && dependency.type === NodeType.Derivation) {
        activate(dependency);
    }
    return usedSlot;
}

function activate(node: DerivationNode<any>) {
    // TODO: remove once proper testing is done
    if (node.obs.length !== 1) throw new Error("Should not be calling activate on a derivation that had observers");
    if (node.depSlots.length !== 0) throw new Error("Deactivated derivation should not be registered and have slots");
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
    // cleanup should be done separately
}

function attemptCleanup(node: DataNode) {
    if (node.type === NodeType.Quark || node.obs.length > 0) {
        return;
    }
    detachDependencies(node, 0);
    // node.dependencies = [];
    node.depSlots = [];
}

function cleanupEffect(effect: EffectNode, deleting: boolean) {
    let unchanged: number;
    if (deleting) {
        unchanged = 0;
        effect.cdeps = DELETED_EFFECT;
    } else {
        unchanged = effect.cdeps;
    }
    const toRemove = effect.deps.length - unchanged;
    if (deleting) {
        detachDependencies(effect, unchanged);
        // console.log(`Deleting effect ${effect.name}. Children: `, effect.children);
    } else {
        // console.log(`Cleaning up effect ${effect.name}. Children: `, effect.children);
    }
    effect.deps.splice(unchanged, toRemove);
    effect.depSlots.splice(unchanged, toRemove);
    if (effect.children) {
        for (let i = 0; i < effect.children.length; i++) {
            cleanupEffect(effect.children[i], true);
        }
    }
    if (effect.clean) {
        for (let i = 0; i < effect.clean.length; i++) {
            effect.clean[i]();
        }
        // when processing updates, we may clean an effect first, then delete it because its parent reruns
        // this avoids running the cleanups twice
        effect.clean = null;
    }
}

function detachDependencies(node: Computation, start: number) {
    const dependencies = node.deps;
    const dependencySlots = node.depSlots;
    for (let i = start; i < dependencies.length; i++) {
        const dep = dependencies[i];
        unhookObserver(node, dep, dependencySlots[i]);
        attemptCleanup(dep);
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
    const scope: Scope = {
        accessed: effect.deps.slice(0, effect.cdeps),
        effects: [],
        cleanups: [],
        parent: CurrentScope
    };
    CurrentScope = scope;
    effect.fn(onCleanup);
    CurrentScope = scope.parent;

    effect.children = scope.effects!.length !== 0
        ? scope.effects
        : null;
    effect.clean = scope.cleanups!.length !== 0
        ? scope.cleanups
        : null;

    const accessed = scope.accessed;
    // TODO: more optimal way to update dependencies, while taking into account constant dependencies?
    // Ideally, only one allocation for the slots
    refreshDependencies(effect, accessed);
    // const deps = effect.d;
    // const slots = effect.ds;
    // // TODO: compare perf vs directly splicing the dependency array
    // for (let i = 0; i < accessed.length; i++) {
    //     slots.push(hookObserver(effect, accessed[i], i));
    //     deps.push(accessed[i]);
    // }
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
    // Clean up the scope before throwing
    // TODO: This probably fails if an error happens in a nested effect / derivation
    // However, effects or derivations may also catch errors
    // Is there a way to handle this, without adding try / catch everywhere?
    CurrentScope = CurrentScope?.parent;
    let msg = errorMsg;
    if (name) msg += ` The problem was hit at quark \"${name}\".`;
    throw new Error(msg);
}
