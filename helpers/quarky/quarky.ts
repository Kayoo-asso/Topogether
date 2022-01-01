// === TYPES ===

import ReactDOM from "react-dom";

// TODO: see if we can make all internal functions monomorphic, i.e. not use union types
// -> this should allow JS engine to optimise much more
// IDEA: implement light subscribers that listen to only a single quark
// TODO: can we remove shouldRecompute by using the sign bit of dirtyCount instead?
// Right now, there are correct scenarios where dirtyCount can go below zero due to cycles

// Optimisation note: never change the shape of the Node object after creation
// See: https://richardartoul.github.io/jekyll/update/2015/04/26/hidden-classes.html

interface QuarkInternal<T> {
    readonly type: NodeType.Quark,
    value: T,
    equal: (a: T, b: T) => boolean,
    observers: Computation[],
    observerSlots: number[],
    name?: string,
}

interface DerivationInternal<T> {
    readonly type: NodeType.Derivation,
    value: T,
    equal: (a: T, b: T) => boolean,
    readonly computation: () => T,
    // 0 means clean or ready to execute (note: may need to separate the two)
    // > 0 means it's waiting for more confirmations
    dirtyCount: number,
    shouldRecompute: boolean, // TODO: replace by the sign bit of dirtyCount
    dependencies: DataNode[],
    dependencySlots: number[],
    observers: Computation[],
    observerSlots: number[],
    name?: string
}

const maxSigned31BitInt = 1073741823;
const ON_STACK = maxSigned31BitInt;

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

interface EffectInternal {
    readonly type: NodeType.Effect,
    readonly computation: (onCleanup: CleanupHelper) => void,
    dirtyCount: number,
    shouldRecompute: boolean, // TODO: remove by using the sign bit of dirtyCount instead
    dependencies: DataNode[],
    dependencySlots: number[],
    // - 1 means the effect has been deleted
    constantDependencies: number,
    children: EffectInternal[] | null,
    cleanups: (() => void)[] | null,
    name?: string
}

const DELETED_EFFECT = -1;

interface Scope {
    accessed: DataNode[],
    effects: EffectInternal[] | null,
    cleanups: (() => void)[] | null,
    parent: Scope | null,
}

type DataNode = QuarkInternal<any> | DerivationInternal<any>;
type Computation = DerivationInternal<any> | EffectInternal;

// === EXPORTED TYPES ===
export interface Quark<T> { readonly type: NodeType.Quark, readonly value: T };
export interface Derivation<T> { readonly type: NodeType.Derivation, readonly value: T };
export interface Effect { readonly type: NodeType.Effect };

export type DataQuark<T> = Quark<T> | Derivation<T>;
export type QuarkArray<T> = Quark<Quark<T>[]>;

// TypeScript dark arts
export type Quarkify<T, Entities> = Quark<{
    [K in keyof T]:
    T[K] extends Entities[]
    ? Quark<Quarkify<T[K][number], Entities>[]>
    : T[K] extends Entities
    ? Quark<Quarkify<T[K], Entities>>
    : T[K]
}>;

export type StateUpdate<T> = T | ((prev: T) => T);
export type CleanupHelper = (cleanup: () => void) => void;

export interface QuarkOptions<T> {
    equal?: ((a: T, b: T) => boolean),
    name?: string,
}

export interface QuarkArrayOptions<T> {
    equal?: ((a: T, b: T) => boolean),
    names?: string[],
    arrayName?: string,
}

export interface QuarkifiedArrayOptions<T, U> {
    quarkifier?: (item: T, index: number) => Quark<U>,
    arrayName?: string,
}

export type Quarkifier<T, U> = (item: T) => Quark<U>;

export interface EffectOptions {
    watch?: DataQuark<any>[], 
    // Lazy means the effect will not run and register dependencies upon creation.
    // It will only get triggered by explicit "watch" dependencies.
    // Setting `lazy: true` without providing `watch` dependencies means the effect will never run.
    // This is especially useful for subscribing components or synchronization with external storage.
    lazy?: boolean,
    name?: string
}

// === GLOBAL CONTEXT ===
let CurrentScope: Scope | null = null;

let PendingQuarks: QuarkInternal<any>[] = [];
let PendingUpdates: StateUpdate<any>[] = [];
let IsBatching = false;

let ScheduledEffects: EffectInternal[] = [];

// === EXTERNAL API ===
// Due to the phantom marker on external types

export function read<T>(node: Quark<T> | Derivation<T>): T {
    return read__internal(
        node as QuarkInternal<T> | DerivationInternal<T>,
        true // register
    );
}

export function peek<T>(node: Quark<T> | Derivation<T>): T {
    return read__internal(
        node as QuarkInternal<T> | DerivationInternal<T>,
        false // don't register
    );
}

export function write<T>(node: Quark<T>, update: StateUpdate<T>) {
    if (CurrentScope && ! CurrentScope.effects) {
        console.error("Quarky detected an attempt to set a value in a derivation! This is not allowed and will be ignored");
        return;
    }
    // Slightly more work for the non-batching case, but this helps centralize the logic
    PendingQuarks.push(node as QuarkInternal<T>);
    PendingUpdates.push(update);
    if (!IsBatching) {
        processUpdates();
    }
}

const defaultEqual = <T>(a: T, b: T) => a === b;

export function quark<T>(value: T, options?: QuarkOptions<T>): Quark<T> {
    const q: QuarkInternal<T> = {
        type: NodeType.Quark,
        value,
        equal: options?.equal ?? defaultEqual,
        observers: [],
        observerSlots: [],
        name: options?.name
    };
    return q;
}

const quarkArrayEqual = <T>(a: Quark<T>[], b: Quark<T>[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        // quarks are referentially stable
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// Overloads
export function quarkArray<T, U>(array: T[], options: QuarkifiedArrayOptions<T, U>): Quark<Quark<U>[]>;
export function quarkArray<T>(array: T[], options?: QuarkArrayOptions<T>): Quark<Quark<T>[]>

export function quarkArray<T, U>(array: T[], options?: QuarkArrayOptions<T> | QuarkifiedArrayOptions<T, U>): Quark<Quark<T | U>[]> {
    const quarks: Quark<T | U>[] = new Array(array.length);
    const quarkifiedOptions = options as QuarkifiedArrayOptions<T, U>;
    const quarkArrayOptions = options as QuarkArrayOptions<T>;
    
    const quarkifier = quarkifiedOptions?.quarkifier
        ? quarkifiedOptions.quarkifier
        : (item: T, i: number) =>
            quark(item, {
                equal: quarkArrayOptions?.equal,
                name: quarkArrayOptions?.names ? quarkArrayOptions.names[i] : undefined
            });

    for (let i = 0; i < array.length; i++) {
        quarks[i] = quarkifier(array[i], i);
    }
    return quark(quarks, { equal: quarkArrayEqual, name: options?.arrayName });
}

export function derive<T>(computation: () => T, options?: QuarkOptions<T>): Derivation<T> {
    // the value will be computed upon first read / attachment of a subscriber effect
    // the undefined is only problematic in case of cyclical dependencies, which are not supported anyways
    const d: DerivationInternal<T> =  {
        type: NodeType.Derivation,
        value: undefined!,
        equal: options?.equal ?? defaultEqual,
        computation,
        dirtyCount: 0,
        shouldRecompute: false,
        observers: [],
        observerSlots: [],
        dependencies: [],
        dependencySlots: [],
        name: options?.name,
    };
    updateDerivation(d);
    return d;
}

export function effect(computation: (onCleanup: CleanupHelper) => void, options?: EffectOptions): Effect {
    if (CurrentScope && !CurrentScope.effects) {
        // clean up the scope before throwing
        CurrentScope = CurrentScope.parent;
        throw new Error("Quarky detected an attempt to create an effect within a derivation! This is not allowed: derivation should be pure functions.");
    }
    const effect: EffectInternal = {
        type: NodeType.Effect,
        computation,
        dependencies: [],
        dependencySlots: [],
        constantDependencies: 0,
        dirtyCount: 0,
        shouldRecompute: false,
        children: null,
        cleanups: null,
        name: options?.name,
    }
    if (options?.watch) {
        const deps = options.watch;
        const slots = new Array(deps.length);
        for (let i = 0; i < deps.length; i++) {
            slots[i] = hookObserver(effect, deps[i] as DataNode, i);
        }
        effect.dependencies = deps as DataNode[];
        effect.dependencySlots = slots;
        effect.constantDependencies = deps.length;
    }

    if (CurrentScope) {
        // console.log(`Pushing effect \"${effect.name}\" onto the scope`);
        CurrentScope.effects!.push(effect);
    }

    if (!options?.lazy) {
        if (IsBatching) {
            ScheduledEffects.push(effect);
        } else {
            runEffect(effect);
        }
    }
    return effect;
}

// Q: should transactions suspend derivation creations? (derivations are pure from Quarky's point of view)
// Q: should transactions suspend effect cleanups?
export function transaction(work: () => void) {
    IsBatching = true;
    work();
    IsBatching = false;
    processUpdates();
}

export function cleanupEffect(effect: Effect) {
    cleanupEffect__internal(effect as EffectInternal, true);
}

// === CORE ===

function read__internal<T>(node: QuarkInternal<T> | DerivationInternal<T>, registerRead: boolean = true): T {
    if (registerRead && CurrentScope) {
        CurrentScope.accessed.push(node);
    }
    // Check for updates - allows for lazy derivations & ensures glitch-free values even w/ concurrency (I think)
    // TODO: check again when we have lazy derivations / concurrency
    // Right now, it assumes the derivation can't be dirty, so it only checks if it is detached
    if (node.type === NodeType.Derivation && node.observers.length === 0) {
        // necessary to detect cycles among potentially deactivated nodes
        if (node.dirtyCount === ON_STACK) {
            // clean up the scope to recover the state
            CurrentScope = CurrentScope!.parent;
            throwError("Quarky detected a cycle!", node.name);
        }
        const saveDirtyCount = node.dirtyCount;
        node.dirtyCount = ON_STACK;
        updateDerivation(node);
        node.dirtyCount = saveDirtyCount;
    }
    return node.value;
}


function processUpdates() {
    const skip = new Array(PendingQuarks.length);
    for (let i = 0; i < PendingQuarks.length; i++) {
        const q = PendingQuarks[i];
        const u = PendingUpdates[i];
        let newValue;
        if (typeof u === "function") {
            newValue = u(q.value);
        } else {
            newValue = u;
        }

        if (q.equal(q.value, newValue)) {
            skip[i] = true;
            continue;
        }

        q.value = newValue;
        for (let j = 0; j < q.observers.length; j++) {
            const o = q.observers[j];
            flagDirty(o);
        }
    }

    for (let i = 0; i < PendingQuarks.length; i++) {
        if (skip[i]) continue;

        const q = PendingQuarks[i];
        for (let j = 0; j < q.observers.length; j++) {
            const o = q.observers[j];
            signalReady(o, true);
        }
    }

    ReactDOM.unstable_batchedUpdates(() => {
        // Children effects may have been scheduled before their parents, so we have
        // to run all cleanups first
        for (let i = 0; i < ScheduledEffects.length; i++) {
            const e = ScheduledEffects[i];
            if (e.constantDependencies === DELETED_EFFECT) continue;
            cleanupEffect__internal(ScheduledEffects[i], false);
        }
        for (let i = 0; i < ScheduledEffects.length; i++) {
            const e = ScheduledEffects[i];
            if (e.constantDependencies === DELETED_EFFECT) continue;
            runEffect(e);
        }
        PendingQuarks = [];
        PendingUpdates = [];
        ScheduledEffects = [];
    });

}

// returns `true` if the value changed
function updateDerivation(node: DerivationInternal<any>): boolean {
    // console.log(`Updating derivation ${node.name}`);
    const scope = {
        accessed: [],
        // effects are not allowed in a derivation
        effects: null,
        cleanups: null,
        parent: CurrentScope
    };
    CurrentScope = scope;
    const next = node.computation();
    CurrentScope = scope.parent;

    // TODO: make it conditional, to avoid attaching detached nodes upon read
    if (node.observers.length > 0) {
        refreshDependencies(node, scope.accessed);
    } else {
        // TODO: remove
        if (node.dependencySlots.length !== 0) {
            throw new Error("Derivation with no observers should have been detached");
        }
        node.dependencies = scope.accessed;
    }

    const prev = node.value;
    node.value = next;
    node.dirtyCount = 0;
    return !node.equal(prev, next);
}

function refreshDependencies(node: DerivationInternal<any>, accessed: DataNode[]) {
    // We go over both arrays at once, since it's likely most dependencies will be the same
    const current = node.dependencies;
    const currentSlots = node.dependencySlots;
    // copy to local for fast access
    const currentLength = current.length;
    const accessedLength = accessed.length;

    const length = Math.min(currentLength, accessedLength);
    const slots = new Array(accessedLength);

    for (let i = 0; i < length; i++) {
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
    for (let i = length; i < currentLength; i++) {
        unhookObserver(node, current[i], currentSlots[i]);
    }
    for (let i = length; i < accessedLength; i++) {
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

    node.dependencies = accessed;
    node.dependencySlots = slots;
}

// returns the slot that was used
function hookObserver(observer: Computation, dependency: DataNode, slot: number): number {
    // console.log(`Hooking observer \"${observer.name}\" to \"${dependency.name}\"`);
    // Dependencies should have been activated through the read call beforehand
    const usedSlot = dependency.observers.length;
    dependency.observers.push(observer);
    dependency.observerSlots.push(slot);
    // check used slot first to avoid memory jump in case it's >0
    if (usedSlot === 0 && dependency.type === NodeType.Derivation) {
        activate(dependency);
    }
    return usedSlot;
}

function activate(node: DerivationInternal<any>) {
    // TODO: remove once proper testing is done
    if (node.observers.length !== 1) throw new Error("Should not be calling activate on a derivation that had observers");
    if (node.dependencySlots.length !== 0) throw new Error("Deactivated derivation should not be registered and have slots");
    const slots = new Array(node.dependencies.length);
    for (let i = 0; i < slots.length; i++) {
        slots[i] = hookObserver(node, node.dependencies[i], i);
    }
    node.dependencySlots = slots;
}

// TODO: measure perf & memory vs using sets
// Not sure this is actually faster, due to a lot of jumps in memory
function unhookObserver(observer: Computation, dependency: DataNode, slot: number) {
    // console.log(`Unhooking observer \"${observer.name}\" from \"${dependency.name}\"`)
    const lastObserver = dependency.observers.pop()!;
    const lastObserverSlot = dependency.observerSlots.pop()!;
    if (lastObserver !== observer) {
        dependency.observers[slot] = lastObserver;
        dependency.observerSlots[slot] = lastObserverSlot;
        lastObserver.dependencySlots[lastObserverSlot] = slot;
    }
    // cleanup should be done separately
}

function attemptCleanup(node: DataNode) {
    if (node.type === NodeType.Quark || node.observers.length > 0) {
        return;
    }
    detachDependencies(node, 0);
    // node.dependencies = [];
    node.dependencySlots = [];
}

function cleanupEffect__internal(effect: EffectInternal, deleting: boolean) {
    let unchanged: number;
    if (deleting) {
        unchanged = 0;
        effect.constantDependencies = DELETED_EFFECT;
    } else {
        unchanged = effect.constantDependencies;
    }
    const toRemove = effect.dependencies.length - unchanged;
    if (deleting) {
        // console.log(`Deleting effect ${effect.name}. Children: `, effect.children);
    } else {
        // console.log(`Cleaning up effect ${effect.name}. Children: `, effect.children);
    }
    detachDependencies(effect, unchanged);
    effect.dependencies.splice(unchanged, toRemove);
    effect.dependencySlots.splice(unchanged, toRemove);
    if (effect.children) {
        for (let i = 0; i < effect.children.length; i++) {
            cleanupEffect__internal(effect.children[i], true);
        }
    }
    if (effect.cleanups) {
        for (let i = 0; i < effect.cleanups.length; i++) {
            effect.cleanups[i]();
        }
    }
}

function detachDependencies(node: Computation, start: number) {
    const dependencies = node.dependencies;
    const dependencySlots = node.dependencySlots;
    for (let i = start; i < dependencies.length; i++) {
        const dep = dependencies[i];
        unhookObserver(node, dep, dependencySlots[i]);
        attemptCleanup(dep);
    }
    // updating the dependency arrays should be done elsewhere, for efficiency reasons
}

// depth-first search, to detect cycles
function flagDirty(node: Computation) {
    if (node.dirtyCount === ON_STACK) {
        throwError("Quarky detected a cycle!", node.name);
    }
    node.dirtyCount += 1;
    // console.log(`Flagging ${node.name} as dirty. dirtyCount = ${node.dirtyCount}`);
    // only propagate the dirty flag if it's the first time this derivation has been dirtied
    if (node.type === NodeType.Derivation && node.dirtyCount === 1) {
        node.dirtyCount = ON_STACK;
        for (let i = 0; i < node.observers.length; i++) {
            const o = node.observers[i];
            flagDirty(o);
        }
        node.dirtyCount = 1;
    }
}

function signalReady(node: Computation, shouldRecompute: boolean) {
    // As far as I understand it, if a cycle is created during an update, this case can be triggered (see tests)
    // It may be possible this error is hit without cycles as well
    if (node.dirtyCount <= 0) {
        throwError("Something went wrong during Quarky's update propagation. This is likely due to a cycle.", node.name)
    }
    node.shouldRecompute ||= shouldRecompute;
    // console.log(`Signaling ready to ${node.name}. dirtyCount (before decrement): ${node.dirtyCount}`);
    if (--node.dirtyCount === 0) {
        if (node.type === NodeType.Effect) {
            if (node.shouldRecompute) {
                ScheduledEffects.push(node);
                node.shouldRecompute = false;
            }
            return;
        }
        // TODO: batch derivation updates as well?
        const valueChanged = node.shouldRecompute && updateDerivation(node);
        node.shouldRecompute = false;
        for (let i = 0; i < node.observers.length; i++) {
            const o = node.observers[i];
            signalReady(o, valueChanged);
        }
    }
}

function runEffect(effect: EffectInternal) {
    // console.log("Running effect " + effect.name);

    const scope: Scope = {
        accessed: [],
        effects: [],
        cleanups: [],
        parent: CurrentScope
    };
    CurrentScope = scope;
    effect.computation(onCleanup);
    CurrentScope = scope.parent;

    effect.children = scope.effects!.length !== 0
        ? scope.effects
        : null;
    effect.cleanups = scope.cleanups!.length !== 0
        ? scope.cleanups
        : null;

    const accessed = scope.accessed;
    const deps = effect.dependencies;
    const slots = effect.dependencySlots;
    // TODO: compare perf vs directly splicing the dependency array
    for (let i = 0; i < accessed.length; i++) {
        slots.push(hookObserver(effect, accessed[i], i));
        deps.push(accessed[i]);
    }
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

function throwError(errorMsg: string, name?: string) {
    let msg = errorMsg;
    if (name) msg += ` The problem was hit at quark \"${name}\".`;
    throw new Error(msg);
}
