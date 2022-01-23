export interface Signal<T> {
    (): T,
}

export interface Quark<T> extends Signal<T> {
    (): T,
    set(value: StateUpdate<T>): void,
}

export interface Effect {
    dispose(): void,
}

export interface ObserverEffect extends Effect {
    watch<T>(computation: () => T): T
}

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


interface Node {
    value: any
    fn: Function | null,
    equal: ((a: any, b: any) => boolean) | ((deleted: boolean) => void) | null,
    status: NodeStatus,
    lastChange: number,
    lastVerified: number,
    // active: boolean,
    // readonly effect: boolean,
    // cleanups: ((deleted: boolean) => void)[] | null,
    deps: Dependency[] | null,
    obs: Observer[] | null,
    readonly name: string | undefined,
}

type Dependency = Leaf<any> | Derived<any>;
type Observer = Derived<any> | Root;

// Use a single enum, to easily distinguish between derivations and effects
// when propagating
const enum NodeStatus {
    // 
    Clean = 0,
    Effect = 1,
    // scheduled derivation or effect
    Dirty = 2,
    Inactive = 4,
    OnStack = 8,
    Tracking = 16,
}

interface Leaf<T> extends Node {
    value: T,
    readonly equal: (a: T, b: T) => boolean,
    readonly fn: null,
    readonly status: NodeStatus.Clean,
    readonly deps: null,
    readonly obs: Observer[],
}

interface Derived<T> extends Node {
    value: T,
    readonly equal: (a: T, b: T) => boolean,
    readonly fn: () => T,
    deps: Dependency[],
    readonly obs: Observer[],
}

interface Root extends Node {
    value: undefined,
    readonly fn: () => void,
    equal: ((deleted: boolean) => void) | null, // cleanup hooks, aggregated into a single function
    deps: Dependency[],
    readonly obs: null,
}

interface Scope {
    accessed: Dependency[],
    effectHooks: ((deleted: boolean) => void)[] | null,
    parent: Scope | null;
}


// === IMPLEMENTATION ===

let Epoch = 0;
// Using a linked list instead of an array for faster checks during reads
// todo: benchmark?
let Scope: Scope | null = null;

let Scheduled = false;

const PendingLeaves: Leaf<any>[] = [];
const PendingUpdates: StateUpdate<any>[] = [];

let ScheduledCleanups: Root[] = [];
let ScheduledEffects: Root[] = [];
let DeactivationCandidates: Derived<any>[] = [];

let ExternalBatcher = (work: () => void) => work();

export function setBatchingBehavior(batcher: (work: () => void) => void) {
    ExternalBatcher = batcher;
}

const defaultEqual = <T>(a: T, b: T) => a === b;

export function quark<T>(initial: T, options?: QuarkOptions<T>): Quark<T> {
    // initialize in the order given in the Node interface, to ensure consistency with others
    const q: Leaf<T> = {
        value: initial,
        fn: null,
        equal: options?.equal ?? defaultEqual,
        status: NodeStatus.Clean,
        lastChange: -1,
        lastVerified: Epoch,
        deps: null,
        obs: [],
        name: options?.name
    };
    const read = () => readLeaf(q);
    read.set = (value: StateUpdate<T>) => {
        writeLeaf(q, value);
        scheduleUpdates();
    }
    // TODO: debug info
    return read;
}

export function derive<T>(fn: () => T, options?: QuarkOptions<T>): Signal<T> {
    const d: Derived<T> = {
        // will be computed upon first read
        value: undefined!,
        fn,
        equal: options?.equal ?? defaultEqual,
        status: NodeStatus.Inactive | NodeStatus.Tracking,
        lastChange: -1,
        lastVerified: -1,
        deps: [],
        obs: [],
        name: options?.name
    };
    const computed = () => readNode(d);
    // TODO: debug info
    return computed;
}

export function effect<T extends Signal<any>[] | readonly Signal<any>[]>(deps: T, computation: (deps: EvaluatedDeps<T>, onCleanup: CleanupHelper) => void, options?: ExplicitEffectOptions): Effect;
export function effect(computation: () => void, options?: EffectOptions): Effect;
export function effect(arg1: any, arg2?: any, arg3?: any): Effect {
    if (typeof arg1 === "function") {
        return simpleEffect(arg1, arg2);
    } else {
        return explicitEffect(arg1, arg2, arg3);
    }
}

function buildEffect(fn: () => void, status: NodeStatus, name?: string): Root {
    return {
        value: undefined,
        fn,
        equal: null,
        status,
        lastChange: -1,
        lastVerified: -1,
        deps: [],
        obs: null,
        name
    };
}

function registerEffect(dispose: () => void, persistent: boolean | undefined) {
    if (Scope && !persistent) {
        if (!Scope.effectHooks) {
            Scope.effectHooks = [dispose];
        } else {
            Scope.effectHooks.push(dispose);
        }
    }
}

function simpleEffect(fn: () => void, options?: EffectOptions): Effect {
    const e = buildEffect(fn, NodeStatus.Effect | NodeStatus.Tracking, options?.name);
    const dispose = () => {
        cleanupEffect(e, true);
        scheduleUpdates();
    };
    registerEffect(dispose, options?.persistent);
    runComputation(e);
    // TODO: debug info
    return {
        dispose
    };
}

function explicitEffect(signals: any[], computation: (deps: any[]) => void, options?: ExplicitEffectOptions): Effect {
    const fn = () => {
        const input = new Array(signals.length);
        for (let i = 0; i < signals.length; ++i) {
            input[i] = signals[i]();
        }
        computation(signals);
    }
    const e = buildEffect(fn, NodeStatus.Effect | NodeStatus.Tracking, options?.name);
    const dispose = () => {
        cleanupEffect(e, true);
        scheduleUpdates();
    };
    // do it before hooking this effect to signals, in case of an error
    registerEffect(dispose, options?.persistent);
    if (options?.lazy) {
        const s: Scope = {
            accessed: e.deps,
            effectHooks: [],
            parent: Scope,
        };
        Scope = s;
        for (let i = 0; i < signals.length; ++i) {
            signals[i]();
        }
        for (let i = 0; i < e.deps.length; ++i) {
            hook(e, e.deps[i]);
        }
        Scope = s.parent;
    } else {
        runComputation(e);
    }
    return {
        dispose
    };
}

export function observerEffect(computation: () => void): ObserverEffect {
    const node = buildEffect(computation, NodeStatus.Effect);
    return {
        watch<T>(computation: () => T): T {
            const scope: Scope = {
                accessed: [],
                effectHooks: null,
                parent: Scope
            };
            Scope = scope;
            const result = computation();
            Scope = scope.parent;
            diffDeps(node, node.deps, scope.accessed);
            node.deps = scope.accessed;
            return result;
        },
        dispose: () => {
            cleanupEffect(node, true);
            scheduleUpdates();
        }
    }
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

export function batch<T>(work: () => T): T {
    const start = PendingLeaves.length;
    const prev = Scheduled;
    Scheduled = true;
    const result = work();
    processUpdates(start);
    if (!prev) processDeactivations();
    Scheduled = prev;
    return result;
}

export function untrack<T>(work: () => T): T {
    const saved = Scope;
    Scope = null;
    const result = work();
    Scope = saved;
    return result;
}

// === CORE ===
function readLeaf<T>(node: Leaf<T>): T {
    if (Scope) {
        Scope.accessed.push(node);
    }
    return node.value;
}

// TODO: is there a way to do less checks & centralise the cycle checking logic?
function readNode<T>(node: Derived<T>): T {
    if (Scope) {
        Scope.accessed.push(node);
    }
    if (node.status !== NodeStatus.Clean && node.lastVerified < Epoch) {
        if (node.status & NodeStatus.OnStack) {
            handleError("Quarky detected a cycle!");
        }
        // TODO: remove once out of debug mode
        node.status |= NodeStatus.OnStack;
        runComputation(node);
        // we know the flag is set here
        node.status ^= NodeStatus.OnStack;
        // this is done in refreshDerived
        // node.lastVerified = Epoch;
    }
    return node.value;
}

// todo: microtask?
function scheduleUpdates() {
    if (!Scheduled) {
        Scheduled = true;
        processUpdates(0);
        processDeactivations();
        Scheduled = false;
    }
}

function processUpdates(start: number) {
    ExternalBatcher(() => {
        // This avoids incrementing the epoch counter if nothing happens
        // (ex: we're only processing deactivations after disposing an effect)
        if (PendingLeaves.length === start && ScheduledEffects.length === 0) return;
        // Increment at the beginning, in case some reads have happened between the end of last epoch and this one
        Epoch += 1;
        do {
            const leaves = PendingLeaves.splice(start);
            const updates = PendingUpdates.splice(start);

            for (let i = 0; i < leaves.length; ++i) {
                const node = leaves[i];
                const u = updates[i];
                const prevValue = node.value;

                node.value = typeof u === "function"
                    ? u(node.value)
                    : u;

                if (node.equal(prevValue, node.value)) continue;

                node.lastChange = Epoch;

                for (let j = node.obs.length - 1; j >= 0; --j) {
                    flagDirty(node.obs[j]);
                }
            }

            let cleanups = ScheduledCleanups;
            let effects = ScheduledEffects;
            ScheduledCleanups = [];
            ScheduledEffects = []

            for (let i = cleanups.length - 1; i >= 0; --i) {
                cleanupEffect(cleanups[i], false);
            }
            // TODO: what happens if an effect runs and should reschedule an effect
            // that is already scheduled for later? The rescheduling should happen 
            // when updating quarks in the next update cycle anyways
            for (let i = effects.length - 1; i >= 0; --i) {
                const e = effects[i];
                // NodeStatus.Clean means deleted for effects
                if (e.status === NodeStatus.Clean) continue;
                checkComputation(e);
            }
        } while (PendingLeaves.length > start || ScheduledEffects.length > 0)
        // Epoch += 1;
    });
}

function processDeactivations() {
    // allows processing deactivation chains efficiently
    let d = DeactivationCandidates.pop();
    while (d !== undefined) {
        if (d.obs.length === 0) {
            // console.log(`Deactivating ${d.name}. Epoch ${Epoch}, lastChange: ${d.lastChange}, lastVerified: ${d.lastVerified}`);
            for (let i = d.obs.length - 1; i >= 0; --i) {
                unhook(d, d.deps[i]);
            }
            d.status |= NodeStatus.Inactive;
        }
        d = DeactivationCandidates.pop();
    }
}

// TODO: is there a way to centralize the cycle checking logic somewhere?
function flagDirty(node: Observer) {
    if (!(node.status & NodeStatus.Dirty)) {
        // console.log(`Flagging ${node.name} as dirty`)
        node.status |= NodeStatus.Dirty;

        if (node.status & NodeStatus.Effect) {
            ScheduledEffects.push(node as Root);
            if (node.equal) ScheduledCleanups.push(node as Root);
        }
        else {
            for (let i = node.obs!.length - 1; i >= 0; --i) {
                flagDirty(node.obs![i]);
            }
        }
    }
}

function checkComputation(node: Observer): boolean {
    // console.log("Actualising " + node.name + " with deps " + node.deps.map(x => x.name));
    let somethingChanged = false;
    for (let i = node.deps.length - 1; i >= 0; --i) {
        const d = node.deps[i];
        if (d.lastChange === Epoch ||
            // leaves never have any bit set on their status flag
            ((d.status & NodeStatus.Dirty) && checkComputation(d as Observer))) {
            somethingChanged = true;
            break;
        }
    }
    if (!(node.status & NodeStatus.Dirty)) throw new Error("Should not be checking clean computations");
    // can use a XOR instead of & ~NodeStatus.Dirty, since we know the dirty flag is not set
    node.status ^= NodeStatus.Dirty;
    return somethingChanged && runComputation(node);
}

function writeLeaf<T>(node: Leaf<T>, update: StateUpdate<T>) {
    PendingLeaves.push(node);
    PendingUpdates.push(update);
}

function activate(node: Derived<any>) {
    // TODO: is this true?
    if (node.lastVerified < Epoch) {
        throw new Error("Activation should always come after a read");
    }
    // console.log("Activating " + node.name);
    node.status &= ~NodeStatus.Inactive;
    for (let i = node.deps.length - 1; i >= 0; --i) {
        hook(node, node.deps[i]);
    }
}

function runComputation(node: Observer): boolean {
    // console.log("Running computation " + node.name);
    const scope: Scope = {
        accessed: [],
        effectHooks: null,
        parent: Scope
    }
    const isDerivation = !(node.status & NodeStatus.Effect);
    Scope = scope;
    const prev = node.value;
    node.value = node.fn();
    Scope = scope.parent;

    let somethingChanged: boolean;
    if (isDerivation) {
        if (scope.effectHooks) {
            console.error("Quarky detected the creation of an effect within a derivation. This is likely a memory leak!");
        }
        somethingChanged = !(node as Derived<any>).equal(prev, node.value);
        node.lastVerified = Epoch;
        if (somethingChanged) node.lastChange = Epoch;
    } else {
        (node as Root).equal = scope.effectHooks
            ? hooksRunner(scope.effectHooks)
            : null;
        // the effect deleted itself
        if (node.status & NodeStatus.Inactive) {
            cleanupEffect(node as Root, true);
            // TODO: clean up this control flow
            // this prevents updating the deps of the effect below
            return true;
        }
        somethingChanged = true;
    }

    // do this after checking for deleted effects and
    // unhoking them from their dependencies
    if (node.status & NodeStatus.Tracking) {
        if (!(node.status & NodeStatus.Inactive)) {
            diffDeps(node, node.deps, scope.accessed);
        } 
        node.deps = scope.accessed
    }

    return somethingChanged;
}


// Have to fallback upon slow diff on first difference,
// since the same node may appear multiple times in before or after
function diffDeps(node: Observer, before: Dependency[], after: Dependency[]) {
    if (depsAreEqual(before, after)) return;

    // easy case for initialisation
    if (before.length === 0) {
        for (let i = 0; i < after.length; ++i) {
            hook(node, after[i]);
        }
        return;
    }

    // console.log("Diffing deps for " + node.name);

    // slow diff
    const toRemove = new Set(before);
    const toAdd = new Set(after);
    for (const x of toRemove) {
        if (!toAdd.delete(x)) {
            unhook(node, x);
        }
    }
    for (const x of toAdd) {
        hook(node, x);
    }
}

function depsAreEqual(before: Dependency[], after: Dependency[]) {
    if (before.length !== after.length) return false;
    for (let i = before.length - 1; i >= 0; --i) {
        if (before[i] !== after[i]) return false;
    }
    return true;
}

function hook(node: Observer, dep: Dependency) {
    if (dep.obs.indexOf(node) !== -1) return;

    // console.log(`Hooking ${node.name} to ${dep.name}`)
    // only alter the observers array of the dependency
    // we directly replace the dependencies of the observer with a new array
    dep.obs.push(node);
    if (dep.status & NodeStatus.Inactive) {
        activate(dep as Derived<any>);
    }
}

function unhook(node: Observer, dep: Dependency) {
    const lastObserver = dep.obs.pop()!;
    // console.log(`Unhooking ${node.name} from ${dep.name}`);
    if (dep.deps && dep.obs.length === 0) {
        DeactivationCandidates.push(dep);
    }
    if (lastObserver !== node) {
        for (let i = dep.obs.length - 1; i >= 0; --i) {
            if (dep.obs[i] === node) {
                dep.obs[i] = lastObserver;
                break;
            }
        }
    }
}

function hooksRunner(hooks: ((deleted: boolean) => void)[]): (deleted: boolean) => void {
    return (deleted: boolean) => {
        // run them in order here
        for (let i = 0; i < hooks.length; ++i) {
            hooks[i](deleted);
        }
    }
}

function cleanupEffect(node: Root, deleted: boolean) {
    if (deleted) {
        // set inactive flag, remove tracking flag
        node.status = node.status | NodeStatus.Inactive & ~NodeStatus.Tracking;
        for (var i = node.deps.length; i-- > 0;) {
            unhook(node, node.deps[i]);
        }
        node.deps = [];
    }
    if (node.equal) {
        // set cleanups to null before running, in case the cleanups themselves rerun or delete the effect
        // this avoids running the same cleanup twice
        const toRun = node.equal;
        node.equal = null;
        toRun(deleted);
    }
}

export function onCleanup(hook: (deleted: boolean) => void): void {
    if (!Scope) {
        console.error("Quarky detected a use of onCleanup outside of any context");
        return;
    }
    if (!Scope.effectHooks) {
        Scope.effectHooks = [hook];
    } else {
        Scope.effectHooks.push(hook);
    }
}

function handleError(message: string): never {
    // clean up the context
    Scope = null;
    PendingLeaves.splice(0);
    PendingUpdates.splice(0);
    ScheduledEffects = [];
    ScheduledCleanups = [];
    Scheduled = false;
    throw new Error(message);
}