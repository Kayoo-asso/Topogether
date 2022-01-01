import { cleanupEffect, DataQuark, derive, effect, quark, read, transaction, write } from "helpers/quarky"
import { getConsoleErrorSpy } from "test/utils";

test("Creating and reading quark", () => {
    const _42 = quark(42);
    const foo = quark("Foo");
    expect(read(_42)).toBe(42);
    expect(read(foo)).toBe("Foo");
});

test("Creating and reading derivations", () => {
    const _42 = quark(42);
    const _84 = derive(() => 2 * read(_42));
    const _21 = derive(() => read(_84) / 4)
    // should be updated upon read, even without observers
    expect(read(_84)).toBe(84);
    expect(read(_21)).toBe(21);
});

test("Non-activated derivations run once upon creation", () => {
    const counter = {
        current: 0
    }
    const d = derive(() => counter.current++);
    expect(counter.current).toBe(1);
})

test("Updating quark propagates to derivations", () => {
    const _1 = quark(1);
    const a = derive(() => read(_1) + 1);
    const b = derive(() => read(a) + 1);
    write(_1, 10);
    expect(read(a)).toBe(11);
    expect(read(b)).toBe(12);
});

test("Updating quark to equal value does not trigger propagation", () => {
    const a = quark(1, { name: "quark" });
    let counter = { current: 0 };
    // Don't do this at home, side effects don't belong in derivations
    const b = derive(() => {
        counter.current += 1;
        return read(a) + 1;
    }, { name: "derivation" });
    // necessary to attach the derivation
    effect(() => { }, { watch: [b], name: "effect" });
    expect(counter.current).toBe(1);
    write(a, 2);
    expect(counter.current).toBe(1);
    write(a, 1);
    expect(counter.current).toBe(2);
});

test("Updating derivation to equal value stops propagation", () => {
    const q = quark(1);
    const d = derive(() => read(q) > 0);
    const counter = { current: 0 };
    const e = effect(() => counter.current++, { watch: [d] });
    expect(counter.current).toBe(1);
    write(q, 10);
    expect(counter.current).toBe(1);
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
    effect(() => counter.effect += 1, { lazy: true });
    expect(counter.effect).toBe(0);
});

test("Lazy effects register dependencies after first run", () => {
    const counter = { current: 0 };
    const q1 = quark(1);
    const q2 = quark(2);
    effect(() => {
        read(q2);
        counter.current++;
    }, { watch: [q1], lazy: true });
    expect(counter.current).toBe(0);
    // q2 has not been registered as dependency yet, it has no effect
    write(q2, q => q + 1);
    expect(counter.current).toBe(0);
    write(q1, q => q + 1);
    expect(counter.current).toBe(1);
    write(q2, q => q + 1);
    expect(counter.current).toBe(2);
})

test("Updating quark triggers effects", () => {
    const counter = { a: 0, b: 0, c: 0 };
    const a = quark(1, { name: "a" });
    const b = derive(() => read(a) + 1, { name: "b" });
    const c = derive(() => read(b) + 1, { name: "c" });
    effect(() => counter.a++, { watch: [a], name: "a watcher" });
    effect(() => counter.b++, { watch: [b], name: "b watcher" });
    effect(() => counter.c++, { watch: [c], name: "c watcher" });
    write(a, 2);
    expect(counter.a).toBe(2);
    expect(counter.b).toBe(2);
    expect(counter.c).toBe(2);
});

test("Cleaning up effect removes it from the graph", () => {
    const q = quark(1);
    const counter = { current: 0 };
    const e = effect(() => counter.current++, { watch: [q] });
    expect(counter.current).toBe(1);
    cleanupEffect(e);
    write(q, 2);
    expect(counter.current).toBe(1);
});

test("Derivations start deactivated", () => {
    const q = quark(2);
    const counter = {
        current: 0
    }
    const d = derive(() => {
        counter.current++;
        return read(q) + 1;
    });
    expect(counter.current).toBe(1);
    write(q, 23);
    expect(counter.current).toBe(1);
});

test("Reading deactivated derivation updates it", () => {
    const q = quark(2);
    const counter = {
        current: 0
    }
    const d = derive(() => {
        counter.current++;
        return read(q) + 1;
    });
    expect(counter.current).toBe(1);
    write(q, 23);
    expect(counter.current).toBe(1);
    read(d);
    expect(counter.current).toBe(2);
});

test("Deactivated derivation B using deactivated derivation A does not activate A", () => {
    const counter = { a: 0, b: 0 };
    const q = quark(1, { name: "q" });
    const a = derive(() => {
        counter.a++;
        return read(q) + 1
    }, { name: "a" });
    const b = derive(() => {
        counter.b++;
        return read(a) + 1
    }, { name: "b" });
    // A executes twice: once upon creation, once upon B's creation
    expect(counter).toStrictEqual({ a: 2, b: 1 });
    write(q, 10);
    expect(counter).toStrictEqual({ a: 2, b: 1 });
});

test("Derivations used by activated derivations are activated", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const a = derive(() => {
        counter.current++;
        return read(q) + 1;
    });
    const b = derive(() => read(a) + 1);
    effect(() => { }, { watch: [b] });
    // A executes twice: once upon creation, once upon B's creation
    expect(counter.current).toBe(2);
    write(q, 2);
    expect(counter.current).toBe(3);
});

test("Cleaning up effect can deactivate derivation", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const d = derive(() => {
        counter.current++;
        return read(q) + 1
    });
    const e = effect(() => read(d));
    expect(counter.current).toBe(2);
    cleanupEffect(e);
    write(q, 2);
    expect(counter.current).toBe(2);
});

test("Creating effect within a derivation throws", () => {
    const counter = { current: 0 };
    expect(() => derive(() => {
        effect(() => counter.current++);
        return 2;
    })).toThrowError();
});

test("Writing to quark within a derivation prints error and is ignored", () => {
    const q = quark(1, { name: "q" });
    const spy = getConsoleErrorSpy();
    const d = derive(() => {
        // this should create an unnecessary subscription, but not cause any problems
        write(q, read(q) + 1);
        return read(q) + 1;
    }, { name: "d" });
    expect(read(d)).toBe(2);
    expect(read(q)).toBe(1);
    // test the spy at the end, since toHaveBeenCalledTimes seems to count all calls within the test,
    // not just calls before the line at which the method is called
    // ex: if we put this test before the line with `read(d)`, it will still have been called twice
    expect(spy).toHaveBeenCalledTimes(2);
});


test("Cycles are detected (propagation)", () => {
    const q = quark(1, { name: "q" });
    const wrapper: { quark: DataQuark<number> } = { quark: q };
    const d = derive(() => read(q) + read(wrapper.quark) + 1, { name: "d" });
    wrapper.quark = d;
    // necessary to activate the derivation
    effect(() => { }, { watch: [d], name: "e" });
    // TODO: check that the error messages are good
    expect(() => write(q, 2)).toThrowError();
});

test("Cycles are detected (reading)", () => {
    const q = quark(1, { name: "q" });
    const wrapper: { quark: DataQuark<number> } = { quark: q };
    const d = derive(() => read(q) + read(wrapper.quark) + 1, { name: "d" });
    wrapper.quark = d;
    // Here d is detached, so reading it will trigger an update, which will read d, etc...
    expect(() => read(d)).toThrowError();
});

test("Custom equality function stops propagation (quark)", () => {
    // settings this quark to `false` does not propagate, because q.equal will return `true`
    const q = quark(true, { equal: (_, b) => !b });
    const counter = { current: 0 };
    effect(() => counter.current++, { watch: [q] });
    expect(counter.current).toBe(1);
    write(q, false);
    expect(counter.current).toBe(1);
});

test("Custom equality function stops propagation (derivation)", () => {
    // settings this quark to `false` does not propagate, because d.equal will return `true`
    const q = quark(true);
    const d = derive(() => read(q), { equal: (_, b) => !b });
    const counter = { current: 0 };
    effect(() => counter.current++, { watch: [d] });
    expect(counter.current).toBe(1);
    write(q, false);
    expect(counter.current).toBe(1);
});

test("Transactions suspend quark writes", () => {
    const q1 = quark(1);
    const q2 = quark(2);
    transaction(() => {
        write(q1, 2);
        write(q2, 3);
        expect(read(q1)).toBe(1);
        expect(read(q2)).toBe(2);
    });
    expect(read(q1)).toBe(2);
    expect(read(q2)).toBe(3);
})

test("Transactions suspend propagation", () => {
    const counter = { current: 0 }
    const q = quark(1, { name: "Q" });
    const d = derive(() => read(q) + 1, { name: "D" });
    effect(() => counter.current++, { watch: [d], name: "E" });
    transaction(() => {
        write(q, 2);
        write(q, 3);
        expect(counter.current).toBe(1);
    });
    expect(read(d)).toBe(4);
    // because the update is batched, the effect only runs once for the 2 writes
    expect(counter.current).toBe(2);
});

test("Transactions suspend effect creation", () => {
    const counter = { current: 0 }
    const q = quark(1, { name: "Q" });
    const d = derive(() => read(q) + 1, { name: "D" });
    transaction(() => {
        effect(() => counter.current++, { watch: [d], name: "E" });
        expect(counter.current).toBe(0);
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
            if (nesting > 1) getEffect(nesting - 1);
            counter.current++;
        }, {
            watch: [q],
            name: `effect-${nesting}`
        });
    getEffect(3);
    expect(counter.current).toBe(3);
    write(q, 2);
    expect(counter.current).toBe(6);
    write(q, 3);
    expect(counter.current).toBe(9);
});

test("Nested effects are cleaned up with their parent", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const getEffect = (nesting: number) =>
        effect(() => {
            if (nesting > 1) getEffect(nesting - 1);
            counter.current++;
        }, { watch: [q] });
    const e = getEffect(3);
    expect(counter.current).toBe(3);
    cleanupEffect(e);
    write(q, 2);
    expect(counter.current).toBe(3);
});

test("Scheduled cleanups run before each effect invokation", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const getEffectWithCleanup = (nesting: number) =>
        effect((onCleanup) => {
            if (nesting > 1) getEffectWithCleanup(nesting - 1);
            onCleanup(() => counter.current++);
        }, { watch: [q] });
    getEffectWithCleanup(3);
    expect(counter.current).toBe(0);
    write(q, 2);
    expect(counter.current).toBe(3);
});

test("Scheduled cleanups run when the effect is cleaned up", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const getEffectWithCleanup = (nesting: number) =>
        effect((onCleanup) => {
            if (nesting > 1) getEffectWithCleanup(nesting - 1);
            onCleanup(() => counter.current++);
        }, { watch: [q] });
    const e = getEffectWithCleanup(3);
    expect(counter.current).toBe(0);
    cleanupEffect(e);
    expect(counter.current).toBe(3);
});

test("Derivation dependencies are dynamically updated", () => {
    const flip = quark(true);
    const q1 = quark(1);
    const q2 = quark(2);
    const counter = { current: 0 };
    const d = derive(() => {
        if (read(flip)) {
            return read(q1);
        } else {
            counter.current++;
            return read(q2);
        }
    });
    // activate the derivation
    effect(() => { }, { watch: [d] });
    expect(counter.current).toBe(0);
    write(q2, 3);
    expect(counter.current).toBe(0);
    write(flip, false);
    expect(counter.current).toBe(1);
    write(q2, 4);
    expect(counter.current).toBe(2);
});

test("Effect dependencies are dynamically upadted", () => {
    const flip = quark(true);
    const q1 = quark(1);
    const q2 = quark(2);
    const counter = { current: 0 };
    effect(() => {
        if (read(flip)) {
            read(q1);
        } else {
            counter.current++;
            read(q2);
        }
    });
    expect(counter.current).toBe(0);
    write(q2, 3);
    expect(counter.current).toBe(0);
    write(flip, false);
    expect(counter.current).toBe(1);
    write(q2, 4);
    expect(counter.current).toBe(2);
});

test("Each node is updated only once per batch (= updates are run in topological order)", () => {
    const counter = { current: 0 };
    const q = quark(1);
    const a = derive(() => read(q) + 1);
    const b = derive(() => read(a) + 1);
    const c = derive(() => read(q) + 1);
    const d = derive(() => {
        counter.current++;
        return read(b) + read(c)
    });
    // activate the chain
    effect(() => { }, { watch: [d] });
    expect(counter.current).toBe(1);
    transaction(() => {
        write(q, 2);
        write(q, 3);
    })
    expect(counter.current).toBe(2);
});

test("Children effects scheduled before their parent should be cleaned up nonetheless", () => {
    const q1 = quark(1, { name: "Q1" });
    const q2 = quark(2, { name: "Q2" });
    const counter = { current: 0 };
    const e = effect(() => {
        effect(() => {
            counter.current++;
        }, { watch: [q2], name: "child-effect" })
    }, { watch: [q1], name: "parent-effect" });
    expect(counter.current).toBe(1);
    transaction(() => {
        write(q2, 10);
        write(q1, 10);
    });
    // only the new child-effect runs, not the old one
    expect(counter.current).toBe(2);
});

test.todo("Peeking");

test.todo("Child effect dependencies are not registered in their parent or children");

test.todo("Persisetng effects");