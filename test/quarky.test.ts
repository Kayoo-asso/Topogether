import exp from "constants";
import { Quark, derive, effect, quark, batch, untrack, Signal, selectSignal, selectQuark, QuarkDebug, EffectDebug, Effect } from "helpers/quarky/quarky"
import { lazy } from "react";
import { getConsoleErrorSpy } from "test/utils";

test("Creating and reading quark", () => {
    const _42 = quark(42);
    const foo = quark("Foo");
    expect(_42()).toBe(42);
    expect(foo()).toBe("Foo");
});

test("Creating and reading derivations", () => {
    const _42 = quark(42);
    const _84 = derive(() => 2 * _42());
    const _21 = derive(() => _84() / 4)
    // should be updated upon read, even without observers
    expect(_84()).toBe(84);
    expect(_21()).toBe(21);
});

test("Updating quark propagates to derivations", () => {
    const _1 = quark(1);
    const a = derive(() => _1() + 1);
    const b = derive(() => a() + 1);
    _1.set(10);
    expect(a()).toBe(11);
    expect(b()).toBe(12);
});

test("Updating quark to equal value does not trigger propagation", () => {
    const a = quark(1, { name: "quark" });
    let counter = { current: 0 };
    // Don't do this at home, side effects don't belong in derivations
    const b = derive(() => {
        counter.current += 1;
        return a() + 1;
    }, { name: "derivation" });
    // necessary to attach the derivation
    effect(() => { b() }, { name: "effect" });
    counter.current = 0;
    expect(counter.current).toBe(0);
    a.set(1);
    expect(counter.current).toBe(0);
    a.set(2);
    expect(counter.current).toBe(1);
});

test("Updating derivation to equal value stops propagation", () => {
    const q = quark(1);
    const d = derive(() => q() > 0);
    const counter = { current: 0 };
    effect(() => { d(); counter.current++ });
    counter.current = 0;
    q.set(10);
    expect(counter.current).toBe(0);
})

test("Effects run immediately", () => {
    const wrapper = {
        hasRun: 0,
    }
    effect(() => wrapper.hasRun += 1);
    expect(wrapper.hasRun).toBe(1);
});

test("Lazy effects don't run immediately", () => {
    const counter = {
        effect: 0,
    }
    effect([], () => counter.effect += 1, { lazy: true });
    expect(counter.effect).toBe(0);
});

test("Lazy effects register dependencies after first run", () => {
    const counter = { current: 0 };
    const q1 = quark(1);
    const q2 = quark(2);
    effect([q1], () => {
        q2();
        counter.current++;
    }, { lazy: true });
    expect(counter.current).toBe(0);
    // q2 has not been registered as dependency yet, it has no effect

    q2.set(q => q + 1);
    expect(counter.current).toBe(0);
    q1.set(q => q + 1);
    expect(counter.current).toBe(1);
    q2.set(q => q + 1);
    expect(counter.current).toBe(2);
})

test("Updating quark triggers effects", () => {
    const counter = { a: 0, b: 0, c: 0 };
    const a = quark(1, { name: "a" });
    const b = derive(() => a() + 1, { name: "b" });
    const c = derive(() => b() + 1, { name: "c" });
    effect(() => { a(); counter.a++ }, { name: "a watcher" });
    effect(() => { b(); counter.b++ }, { name: "b watcher" });
    effect(() => { c(); counter.c++ }, { name: "c watcher" });
    a.set(2);
    expect(counter.a).toBe(2);
    expect(counter.b).toBe(2);
    expect(counter.c).toBe(2);
});

test("Cleaning up effect removes it from the graph", () => {
    const q = quark(1);
    const counter = { current: 0 };
    const e = effect(() => { q(); counter.current++ });
    expect(counter.current).toBe(1);
    e.dispose();
    q.set(2);
    expect(counter.current).toBe(1);
});

test("Derivations start deactivated", () => {
    const q = quark(2);
    const counter = {
        current: 0
    }
    const d = derive(() => {
        counter.current++;
        return q() + 1;
    });
    expect(counter.current).toBe(0);
    q.set(23);
    expect(counter.current).toBe(0);
});

test("Reading inactive derivation updates it", () => {
    const q = quark(2);
    const counter = {
        current: 0
    }
    const d = derive(() => {
        counter.current++;
        return q() + 1;
    });
    expect(counter.current).toBe(0);
    d();
    expect(counter.current).toBe(1);
    d();
    expect(counter.current).toBe(2);
});

test("Deactivated derivation B using deactivated derivation A does not activate A", () => {
    const counter = { a: 0, b: 0 };
    const q = quark(1, { name: "q" });
    const a = derive(() => {
        counter.a++;
        return q() + 1
    }, { name: "a" });
    const b = derive(() => {
        counter.b++;
        return a() + 1
    }, { name: "b" });
    expect(counter).toStrictEqual({ a: 0, b: 0 });
    q.set(10);
    expect(counter).toStrictEqual({ a: 0, b: 0 });
});

test("Derivations used by activated derivations are activated", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const a = derive(() => {
        counter.current++;
        return q() + 1;
    });
    const b = derive(() => a() + 1);
    effect(() => b());
    counter.current = 0;
    q.set(2);
    expect(counter.current).toBe(1);
});

test("Cleaning up effect can deactivate derivation", () => {
    const counter = { current: 0 };
    const q = quark(1, { name: "Q" });
    const d = derive(() => {
        counter.current++;
        return q() + 1
    }, { name: "D" });
    const e = effect(() => d(), { name: "E" });
    counter.current = 0;
    expect(counter.current).toBe(0);
    e.dispose();
    q.set(2);
    expect(counter.current).toBe(0);
});

test("Creating effect within a derivation throws", () => {
    const counter = { current: 0 };
    const d = derive(() => {
        effect(() => counter.current++);
        return 2;
    })
    expect(d).toThrowError();
});

test("Writing to quark within a derivation prints error and is ignored", () => {
    const q = quark(1, { name: "q" });
    const spy = getConsoleErrorSpy();
    const d = derive(() => {
        // this should create an unnecessary subscription, but not cause any problems
        q.set(q() + 1);
        return q() + 1;
    }, { name: "d" });
    expect(d()).toBe(2);
    expect(q()).toBe(1);
    // test the spy at the end, since toHaveBeenCalledTimes seems to count all calls within the test,
    // not just calls before the line at which the method is called
    expect(spy).toHaveBeenCalledTimes(1);
});

// TODO: redo this one once lazy effects are back, it hits a dirtyCount < 0 only using a lazy effect
test("Cycles are detected (propagation)", () => {
    const q = quark(1, { name: "q" });
    const wrapper: { quark: Signal<number> } = { quark: q };
    const d = derive(() => q() + wrapper.quark() + 1, { name: "d" });
    // necessary to activate the derivation
    effect([d], () => { }, { lazy: true, name: "e" });
    // create the cycle after the effect has read `d` and registered as an observer
    wrapper.quark = d;
    // TODO: check that the error messages are good
    expect(() => q.set(2)).toThrowError();
});

test("Cycles are detected (reading)", () => {
    const q = quark(1, { name: "q" });
    const wrapper: { quark: Signal<number> } = { quark: q };
    const d = derive(() => q() + wrapper.quark() + 1, { name: "d" });
    wrapper.quark = d;
    // Here d is detached, so reading it will trigger an update, which will read d, etc...
    expect(() => d()).toThrowError();
});

test("Custom equality function stops propagation (quark)", () => {
    // settings this quark to `false` does not propagate, because q.equal will return `true`
    const q = quark(true, { equal: (_, b) => !b });
    const counter = { current: 0 };
    effect(() => { q(); counter.current++ });
    expect(counter.current).toBe(1);
    q.set(false);
    expect(counter.current).toBe(1);
});

test("Custom equality function stops propagation (derivation)", () => {
    // settings this quark to `false` does not propagate, because d.equal will return `true`
    const q = quark(true);
    const d = derive(() => q(), { equal: (_, b) => !b });
    const counter = { current: 0 };
    effect(() => { d(); counter.current++; });
    expect(counter.current).toBe(1);
    q.set(false);
    expect(counter.current).toBe(1);
});

test("Batches suspend quark writes", () => {
    const q1 = quark(1);
    const q2 = quark(2);
    batch(() => {
        q1.set(2);
        q2.set(3);
        expect(q1()).toBe(1);
        expect(q2()).toBe(2);
    });
    expect(q1()).toBe(2);
    expect(q2()).toBe(3);
})

test("Batches suspend propagation", () => {
    const counter = { current: 0 }
    const q = quark(1, { name: "Q" });
    const d = derive(() => q() + 1, { name: "D" });
    effect(() => { d(); counter.current++ }, { name: "E" });
    batch(() => {
        q.set(2);
        q.set(3);
        expect(counter.current).toBe(1);
    });
    expect(d()).toBe(4);
    // because the update is batched, the effect only runs once for the 2 writes
    expect(counter.current).toBe(2);
});

test("Batches do not suspend effect creation", () => {
    const counter = { current: 0 }
    const q = quark(1, { name: "Q" });
    const d = derive(() => q() + 1, { name: "D" });
    batch(() => {
        effect(() => { d(); counter.current++; }, { name: "E" });
        expect(counter.current).toBe(1);
    });
    expect(counter.current).toBe(1);
});

test("Nested effects do not accumulate", () => {
    const counter = { current: 0 };
    const q = quark(1, {
        name: "Q"
    });
    const getEffect = (nesting: number) =>
        effect(() => {
            q();
            if (nesting > 1) getEffect(nesting - 1);
            counter.current++;
        }, {
            name: `effect-${nesting}`
        });
    getEffect(3);
    expect(counter.current).toBe(3);
    q.set(2);
    expect(counter.current).toBe(6);
    q.set(3);
    expect(counter.current).toBe(9);
});

test("Nested effects are cleaned up with their parent", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const getEffect = (nesting: number) =>
        effect(() => {
            q();
            if (nesting > 1) getEffect(nesting - 1);
            counter.current++;
        });
    const e = getEffect(3);
    expect(counter.current).toBe(3);
    e.dispose();
    q.set(2);
    expect(counter.current).toBe(3);
});

test("Scheduled cleanups run before each effect invokation", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const getEffectWithCleanup = (nesting: number) =>
        effect((onCleanup) => {
            q();
            if (nesting > 1) getEffectWithCleanup(nesting - 1);
            onCleanup(() => counter.current++);
        }, { name: `clean-effect-${nesting}` });
    getEffectWithCleanup(3);
    expect(counter.current).toBe(0);
    q.set(2);
    expect(counter.current).toBe(3);
    q.set(3);
    expect(counter.current).toBe(6);
});

test("Scheduled cleanups run when the effect is cleaned up", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const getEffectWithCleanup = (nesting: number) =>
        effect((onCleanup) => {
            q();
            if (nesting > 1) getEffectWithCleanup(nesting - 1);
            onCleanup(() => counter.current++);
        });
    const e = getEffectWithCleanup(3);
    expect(counter.current).toBe(0);
    e.dispose();
    expect(counter.current).toBe(3);
});

test("Derivation dependencies are dynamically updated", () => {
    const flip = quark(true);
    const q1 = quark(1);
    const q2 = quark(2);
    const counter = { current: 0 };
    const d = derive(() => {
        if (flip()) {
            return q1();
        } else {
            counter.current++;
            return q2();
        }
    });
    // activate the derivation
    effect(() => d());
    expect(counter.current).toBe(0);
    q2.set(3);
    expect(counter.current).toBe(0);
    flip.set(false);
    expect(counter.current).toBe(1);
    q2.set(4);
    expect(counter.current).toBe(2);
});

test("Effect dependencies are dynamically upadted", () => {
    const flip = quark(true);
    const q1 = quark(1);
    const q2 = quark(2);
    const counter = { current: 0 };
    effect(() => {
        if (flip()) {
            q1();
        } else {
            counter.current++;
            q2();
        }
    });
    expect(counter.current).toBe(0);
    q2.set(3);
    expect(counter.current).toBe(0);
    flip.set(false);
    expect(counter.current).toBe(1);
    q2.set(4);
    expect(counter.current).toBe(2);
});

test("Each node is updated only once per batch (= updates are run in topological order)", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const a = derive(() => q() + 1);
    const b = derive(() => a() + 1);
    const c = derive(() => q() + 1);
    const d = derive(() => {
        counter.current++;
        return b() + c()
    });
    // activate the chain
    effect(() => d());
    counter.current = 0;
    batch(() => {
        q.set(2);
        q.set(3);
    })
    expect(counter.current).toBe(1);
});

test("Children effects scheduled before their parent should be cleaned up nonetheless", () => {
    const q1 = quark(1, { name: "Q1" });
    const q2 = quark(2, { name: "Q2" });
    const counter = { current: 0 };
    const e = effect(() => {
        q1();
        effect(() => {
            q2();
            counter.current++;
        }, { name: "child-effect" })
    }, { name: "parent-effect" });
    expect(counter.current).toBe(1);
    batch(() => {
        q2.set(10);
        q1.set(10);
    });
    // only the new child-effect runs, not the old one
    expect(counter.current).toBe(2);
});

test("Peeking does not add dependencies to derivations", () => {
    const q1 = quark(1);
    const q2 = quark(1);
    const counter = { current: 0 };
    const d = derive(() => { counter.current++; q1() + untrack(() => q2()) });
    // activate derivation
    effect(() => d());
    counter.current = 0;
    q1.set(2);
    expect(counter.current).toBe(1);
    q2.set(2);
    expect(counter.current).toBe(1);
});

test("Peeking does not add dependencies to effects", () => {
    const q1 = quark(1);
    const q2 = quark(1);
    const counter = { current: 0 };
    effect(() => { counter.current++; q1() + untrack(() => q2()) });
    // activate derivation
    counter.current = 0;
    q1.set(2);
    expect(counter.current).toBe(1);
    q2.set(2);
    expect(counter.current).toBe(1);
});

test("Child effect dependencies are not registered in their parent or children", () => {
    const q1 = quark(1);
    const q2 = quark(1);
    const counter = { current: 0 };
    effect(() => {
        counter.current++;
        q1();
        effect(() => {
            counter.current++;
            q2();
        })
    });
});

test("Persisting effects", () => {
    const triggerWrapper = quark(false);
    const inc = quark(false);
    let persistentEffect: Effect | undefined = undefined;
    let counter = 0;
    const wrapperEffect = effect([triggerWrapper], () => {
        if (persistentEffect === undefined) {
            persistentEffect = effect([inc], () => {
                counter += 1;
            }, { lazy: true, persistent: true })
        }
    });
    // persistentEffect should survive a rerun or a cleanup of wrapperEffect
    expect(counter).toBe(0);
    inc.set(x => !x);
    expect(counter).toBe(1);
    triggerWrapper.set(x => !x);
    expect(counter).toBe(1);
    inc.set(x => !x);
    expect(counter).toBe(2);
    wrapperEffect.dispose();
    inc.set(x => !x);
    expect(counter).toBe(3);
});

test("Nested batch resolves before outer batch", () => {
    const q = quark(1);
    batch(() => {
        q.set(q() + 1);
        batch(() => {
            q.set(c => c + 1);
            q.set(c => c + 1);
            expect(q()).toBe(1);
        });
        expect(q()).toBe(3);
        q.set(q() + 1);
    });
    expect(q()).toBe(4);
});

test("Effects are created normally within a batch", () => {
    const q = quark(1);
    let effectRuns = 0;
    batch(() => {
        q.set(2);
        effect([q], () => effectRuns += 1);
    });
    // once upon creation, once after setting the quark
    expect(effectRuns).toBe(2);
});

test("Derivations are created normally within a batch", () => {
    const q = quark(1);
    let effectRuns = 0;
    batch(() => {
        q.set(2);
        const d = derive(() => 2 * q());
        effect([d], () => effectRuns += 1);
    });
    // once upon creation, once after setting the quark
    expect(effectRuns).toBe(2);
});

test("Effect cleanups happen immediately within a batch", () => {
    let effectRuns = 0;
    const q = quark(1);
    const e = effect([q], () => effectRuns += 1);
    expect(effectRuns).toBe(1);
    batch(() => {
        q.set(2);
        e.dispose();
    });
    expect(effectRuns).toBe(1);
});

// This exact scenario was encountered when React component subscriptions
// disposed and recreated the effect upon each rerender. The subscription effect
// would dispose itself, causing bugs all over the place.
test("Lazy effect that ends up cleaning itself during execution runs cleanups and does not stay alive", () => {
    const effectRef: { current: Effect } = { current: undefined! };
    const trigger = quark(false) as QuarkDebug<boolean>;
    let counter = 0;
    let cleanupRuns = 0;
    const e = effect(
        [trigger],
        (_, onCleanup) => {
            effectRef.current.dispose();
            // this dependency should not be added after disposal & current execution
            trigger();
            counter += 1;
            onCleanup(() => cleanupRuns += 1);
        },
        { lazy: true }
    ) as EffectDebug;
    effectRef.current = e

    trigger.set(x => !x);
    expect(counter).toBe(1);
    expect(cleanupRuns).toBe(1);
    expect(trigger.node.obs.length).toBe(0);
    expect(trigger.node.oSlots.length).toBe(0);
    expect(e.node.deps.length).toBe(0);
    expect(e.node.depSlots.length).toBe(0);
    expect(e.node.cdeps).toBe(-1); // means deleted

    trigger.set(x => !x);
    expect(counter).toBe(1);
});

test.todo("Zipping and concatenating iterators calls the init function of both arguments");

test("Empty SelectSignalNullable", () => {
    const s = selectSignal<string>();
    expect(s()).toBe(undefined);
    expect(s.quark()).toBe(undefined);
});

test("Setting and unsetting SelectSignalNullable", () => {
    const s = selectSignal<string>();
    const value = quark("foo");

    s.select(value);
    expect(s()).toBe("foo");
    expect(s.quark()).toBe(value);

    s.select(undefined);
    expect(s()).toBe(undefined);
    expect(s.quark()).toBe(undefined);
});

test("Setting and unsetting SelectSignal", () => {
    const v1 = quark("foo");
    const v2 = quark("bar");

    const s = selectSignal(v1);
    expect(s()).toBe("foo");
    expect(s.quark()).toBe(v1);

    s.select(v2);
    expect(s()).toBe("bar");
    expect(s.quark()).toBe(v2);
});

test("Empty SelectQuarkNullable", () => {
    const s = selectQuark<string>();
    expect(s()).toBe(undefined);
    expect(s.quark()).toBe(undefined);
});

test("Setting and unsetting SelectQuarkNullable", () => {
    const s = selectQuark<string>();
    const value = quark("foo");

    s.select(value);
    expect(s()).toBe("foo");
    expect(s.quark()).toBe(value);

    value.set("bar");
    expect(s()).toBe("bar");

    s.select(undefined);
    expect(s()).toBe(undefined);
    expect(s.quark()).toBe(undefined);
});


test("Setting and unsetting SelectSignal", () => {
    const v1 = quark("foo");
    const v2 = quark("bar");

    const s = selectSignal(v1);
    expect(s()).toBe("foo");
    expect(s.quark()).toBe(v1);

    v1.set("foo2");
    expect(s()).toBe("foo2");

    s.select(v2);
    expect(s()).toBe("bar");
    expect(s.quark()).toBe(v2);

    v1.set("foo3");
    expect(s()).toBe("bar");
    v2.set("foo4");
    expect(s()).toBe("foo4");
});

test("Lazy effects only register once and are cleaned up correctly", () => {
    const Q = quark(1) as QuarkDebug<number>;
    const node = Q.node;
    const E = effect([Q], () => { }) as EffectDebug;
    expect(node.obs).toEqual([E.node]);
    expect(node.oSlots).toEqual([0]);
    // trigger the effect, since there have been many problems about lazy effects double registering their dependencies upon first run
    Q.set(2);
    E.dispose();
    expect(node.obs).toEqual([]);
    expect(node.oSlots).toEqual([]);
});

test("Effect observing a quark 2+ times only runs once on update", () => {
    const Q = quark(1) as QuarkDebug<number>;
    const node = Q.node;
    const counter = { current: 0 };
    const E = effect(() => {
        Q(); Q();
        counter.current += 1
    }) as EffectDebug;

    expect(node.obs).toEqual([E.node, E.node]);
    counter.current = 0;
    Q.set(2);
    expect(counter.current).toEqual(1);
});

test("Effect observing multiple modified quarks only runs once on update", () => {
    const Q1 = quark(1);
    const Q2 = quark(1);
    const D = derive(() => Q2() + 1);
    const counter = { current: 0 };
    const E = effect(() => {
        D(); Q1();
        counter.current += 1;
    });
    counter.current = 0;
    batch(() => {
        Q1.set(2);
        Q2.set(2);
    });
    expect(counter.current).toBe(1);
});

test.todo("Activating a derivation from a new effect does not (re)run the effect");

test.todo("Activating / deactivating a derivation multiple times in a batch only recomputes its value once");

test("Effects are batched", () => {
    const trigger = quark(false);
    const q1 = quark(0);
    const q2 = quark(0);
    let counter = 0;
    effect([q1, q2], () => counter += 1, { lazy: true });
    effect([trigger], () => {
        q1.set(x => x + 1);
        q2.set(x => x + 1);
        q2.set(x => x + 1);
    }, { lazy: true });
    trigger.set(x => !x);
    expect(q1()).toBe(1);
    expect(q2()).toBe(2);
    expect(counter).toBe(1);
})

test.todo("ObserverEffect");

test.todo("Explicit effects receive the current value of their dependencies");

test.todo("Runaway update cycles are detected");

test("Storing functions in quarks", () => {
    const inc = (x: number) => x + 1;
    const q = quark(inc);
    expect(q()).toBe(inc);
    // passing in a wrapped value
    const double = (x: number) => inc(inc(x));
    q.set(() => double);
    expect(q()).toBe(double);
    // passing in an update function
    let quadruple: (x: number) => number;
    q.set((prev: (x: number) => number) => {
        quadruple = (x) => prev(prev(x));
        return quadruple
    });
    expect(q()).toBe(quadruple!);
});
