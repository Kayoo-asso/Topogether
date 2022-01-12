# Quarky.js
A tiny reactive library for complex state management and performance. Currently, the main integration is with React, but the core library is framework-agnostic.

## Philosophy
TODO 

## Basics
Quarky is a reactive system based on 3 primitives:
- **Quarks:** little wrappers around your data.
- **Derivations:** values computed from other quarks or derivations.
- **Effects:** functions that run automatically when something changes.

The _"reactive"_ aspect of Quarky means that whenever some data changes, everything that depends on it gets updated. This allows you to use the same piece of information in multiple parts of your application, without worrying about how to keep them in sync.

Here's an example:
```ts
const count = quark(0);
const double = derive(() => 2 * count());
effect(() => console.log("The count is now " + count()));

count.set(c => c + 1); // "The count is now 1"
console.log(double()); // "2"
```

### Quarks
Quarks are the first building block: they are containers for your data. They are also called "atoms" in other libraries like [Recoil](https://recoiljs.org/) or [Jotai](https://github.com/pmndrs/jotai). Typically, you'll want to wrap your entities in quarks:

```ts
const book = quark({
    title: "Permutation City",
    year: 1995,
    genre: "SF",
    author: quark({
        firstName: "Greg",
        lastName: "Egan",
        nationality: "Australian",
    }),
})
```

A quark can be used in one of two ways:
1) by calling it as function, to read its current value
2) by calling its `set` method, to update its value

```ts
function incrementTwice(count: Quark<number>) {
    const current = count();
    count.set(current + 1);
    count.set(c => c + 1);
}
```

You'll notice that the `set` function accepts both new values and update functions, which take the old value as input and return a new value.

In case you're wondering why you have to invoke a quark like a function to read it: it allows Quarky to know where each value is used and keep everything in sync.

One interesting aspect of quarks is that they are _referentially stable_: even when you modify the value within, the `Quark<T>` object stays the same. This is especially useful when you are doing something like memoising a component in React. The same goes for the setter, which is also safe to pass around to functions or as component prop. 

### Derivations
Once you have your model data, you'll likely want to compute things that depend on it. Those computations can be done on-the-spot, like within a component. But sometimes you'll want to memoise the result and update it automatically - especially if you're using that value in multiple places. For this purpose, you can create **derivations**.

```ts
function averageRating(ratings: Quark<number>[]): Signal<number> {
    return derive(() => {
        let total = 0;
        for(const rating of ratings) {
            total += rating();
        }
        return total / ratings.length;
    });
}
const ratings = [quark(4.8), quark(3.7), quark(4.3), quark(2.6)];
const avgRating = averageRating(ratings);
console.log(avgRating());
```

If the value of any quark in the `ratings` array changes, the average rating will be updated as well. Note that if you add or remove quarks from the list, you'll need to recreate the derivation.

Derivations essentially behave like quarks, except that they are read-only. The `Signal<T>` interface is common to both and means that they are functions `() => T`. Quarks just have an additional setter. From now on, we'll use the term *signals* to refer to both quarks and derivations.

You'll notice that you can read other signals as usual when writing derivations, Quarky takes care of tracking dependencies. Upon creation, each derivation is run once, to compute its value and determine its dependencies.

Derivations are meant to be _pure functions_ of your data. That means you can't set quarks or create effects within derivations - you'll get an error if you try to. You should also avoid any kind of external mutation or interaction in your derivations.

### Effects
Effects are the third main piece of Quarky's reactive system. They allow you to perform any kind of external work based on values within Quarky and will rerun whenever something changes. For example, they can be used to rerender components whenever one of their dependencies changes, or to automatically synchronise your data with some external storage.

```ts
function enableSync(book: Quark<Book>) {
    effect(() => {
        const book = book();
        localStorage.setItem(book.id, JSON.stringify(book))
    });
}
```

Now, whenever the book changes, the effect will rerun and the book will be saved to `localstorage` using its ID.

In the above example, the effect will remain active forever and keep the quark alive in memory as well. This is a memory leak - exactly the same as if you had forgotten an event listener somewhere. To fix it, we can do the following:

```ts
const effects: Map<number, Effect> = new Map();

function enableSync(book: Quark<Book>) {
    const book = book();
    if(!effects.has(book.id)) {
        const e = effect(() => {
            localStorage.setItem(book.id, JSON.stringify(book))
        });
        effects.set(book.id, e);
    }
}

function deleteBook(book: Quark<Book>) {
    const book = book();
    localStorage.removeItem(book.id);
    const syncEffect = effects.get(book.id);
    if(syncEffect) {
        syncEffect.dispose();
        effects.delete(book.id);
    }
}
```

You can also set quarks within effects. For instance, you could create "homemade derivations":

```ts
const count = quark(1);
// using a derivation
const double = derive(() => 2 * count());
// using an effect
const homemadeDouble = quark(0);
effect(() => {
    homemadeDouble.set(2 * count());
});
```

In this case, if `double` and `homemadeDouble` are used elsewhere, they will behave roughly in the same way. The main differences are that derivations have better performance and ensure memory is freed automatically.

Effects are very powerful and, as such, they require some care to use correctly. We'll see more about their capabilities in the [best practices section](#best-practices).

### Updates and equality checks
It's helpful to understand a bit about how Quarky's update system works.

Changes within Quarky can only be triggered by setting quarks. Once one or more quarks receive a new value, an update is propagated to all dependent derivations and effects. The update process goes as follows:
1. Update all quarks
2. Update all derivations
3. Run all effects
4. If those effects triggered more changes, go back to 1.

Quarky runs all updates **synchronously**: as soon as something changes, an update process is triggered. Updates are run "in order", which means that for each cycle, each updated derivation or effect runs at most once - only when its dependencies have fully updated.

If a quark or derivation receives a new value that is equal to the previous one, the update process can be stopped early and dependent derivations or effects are not rerun. By default, Quarky uses the standard JavaScript `prev === next` comparison, but a custom equality function can be provided to `quark(...)` or `derive(...)`.

To avoid unnecessary work, derivations that are not used directly or indirectly by any effect are **inert**. They will not be automatically updated and will instead be recomputed with every read. Only derivations used by effects or other **alive** derivations receive updates. For example, in React, your components subscribe to the signals they use and keep them alive.

### Batching

As mentioned earlier, Quarky runs updates immediately. If you want to perform multiple operations at once, you can use the `batch()` function.

```ts
const count = quark(1);
effect(() => console.log("The count is now " + count()));
// logs "The count is now 1"
batch(() => {
    count.set(count() + 1);
    count.set(count() + 2);
    count.set(count() + 3);
});
// only logs "The count is now 4"
```

A batch suspends all writes to quarks until the end of the batch, then runs all updates scheduled within the batch. In the example above, the value of `count()` remains 1 until the end of the batch. Derivations and effects are created and disposed as usual within a batch.

You will notice that the effect only triggered once, despite 3 writes to the `count` quark. All writes within a batch are processed in a single update, which means dependent derivations and effects run at most once.

By default, all operations within an effect are batched.

In case you want to ensure some operations are run immediately within a batch, you can nest batches:

```ts
const count = quark(1);
effect(() => console.log("The count is now " + count()));
// logs "The count is now 1"
batch(() => {
    count.set(count() + 1);
    batch(() => {
        count.set(c => c + 1);
        count.set(c => c + 1);
    });
    count.set(count() + 1);
});
// logs:
// "The count is now 3" [inner batch]
// "The count is now 4" [outer batch]
```

### Untracking
We have seen that all signal reads within a derivation or an effect are automatically tracked by Quarky. In case you want to access the value of a signal without registering it as dependency, you can use `untrack`.

```ts
const trigger = quark(false);
const A = quark(1);
const B = quark(1);
effect(() => {
    trigger(); // register the dependency
    const result = untrack(() => A() + B());
    console.log("A + B = " + result);
});
A.set(2); // does not trigger the effect
B.set(3); // does not trigger the effect
trigger.set(x => !x); // logs "A + B = 5"
```

## React integration

### General philosophy
TODO

### Subscribing components

Using Quarky within React is simple: any component that wants to receive updates from Quarky should be wrapped with `watchDependencies`.

You can then directly read quarks, **without using hooks** and the component will be rerendered once one of its dependencies change. Yep, no hooks, no rules!

```tsx
import { Quark } from "quarky";
import { useCreateQuark, watchDependencies } from "quarky/react";

// we'll see a better way to do this soon
const count = quark(1);

export const Parent = watchDependencies(() => {
    console.log("Rendered parent!");
    return <>
        <Counter count={count} id={1} />
        <Counter count={count} id={2} />
        <Counter count={count} id={3} />
    </>
});

interface CounterProps {
    count: Quark<number>,
    id: number,
};

export const Counter = watchDependencies((props: CounterProps) => {
    const { count, id } = props;
    console.log("Rendered Counter n°" + id);
    const onClick = () => count.set(c => c + 1);
    return (
        <button onClick={onClick}>
            {count()}
        </button>
    );
});
```

Here, the children are all sharing the same quark and will all update together on each increment - without rerendering the parent.

You can also use conditionals and loops without any problem: Quarky takes care of updating dependencies every time your component runs. This is a totally valid component:

```tsx
interface Props {
    mainRating: Quark<number>,
    otherRatings: Quark<number>[],
    average: Quark<boolean>
}

export const ThisIsOkay = watchDependencies((props: Props) => {
    const { mainRating, otherRatings, average } = props;
    let rating = mainRating();
    if(average()) {
        for(const other of otherRatings) {
            rating += other();
        }
        rating / (otherRatings.length + 1)
    };
    return <div>Rating: {rating}</div>
});
```

One important thing to note is that signals are **referentially stable**: even as the value within a quark or derivation changes, the `Quark<T>` or `Signal<T>` object remains the same reference. This is especially useful when memoising components.

For this reason, `watchDependencies` memoises components by default. If you want to disable memoisation, you can pass the `memo: false` option:
```ts
const nonMemoised = watchDependencies((props: Props) => {
    // ...
}, { memo: false })
```

The `Quark<T>.set` method is also referentially stable and safe to pass around, in case a component only needs to write to a quark.

Note that writing to a quark does not subscribe the component to the quark - only reading its value does.

[TODO: add more examples]

### Hooks and utilities
TODO:
- `useCreateQuark<T>`
- `useSelectQuark<T>` and `useSelectSignal<T>`
- `reactKey`

### `Show` component
A common pattern in React is to control the rendering of a child from the parent based on a boolean. We can do the same with Quarky:

```tsx
const Parent = watchDependencies(({ selected }: Props) => {
    return <>
        {selected() &&
            <ShowSelected selected={selected()!} />
        }
    </>
});
```

The problem is that if the value of `renderChild` changes, the whole `Parent` component will rerender: it may contain a lot of other things, but we only want to rerender the part that shows the `Child` or not.

You'll also notice that working with the value within `selected` is not pleasant, since TypeScript can't determine that next call to `selected()` will not be `undefined`.

To make this pattern more performant and pleasant to use, Quarky comes with a built-in `Show` component:

```tsx
const Parent = watchDependencies(({ selected }: Props) => {
    return <>
        <OtherStuff />
        <Show when={() => selected()}>
            <div>Something is selected!</div>
        </Show>
        <Show when={() => selected()}>
            {x => <ShowSelected selected={x} /> }
        </Show>
        <OtherStuff />
    </>
});
```

Here, the condition will only run within the `Show` components and they will be the ones that catch the subscription to `selected`, not the `Parent` component. This means that if `selected` changes, the `Show` components will rerender, but not the other stuff around it.

You can also provide a callback as a child to `Show`: this callback will receive the return value of the `when` condition, when it is not a falsy value. In case you need to check multiple values, you can also return an array.

Finally, `Show` can show a fallback when the condition is not met.

Here is an example that ties it all together:

```tsx
interface Props {
    pizza: Quark<Pizza | undefined>
    toppings: Quark<Toppings | undefined>
}

const Component = watchDependencies(({ selected }: Props) => {
    return <>
        <OtherStuff />
        <Show 
            when={() => [pizza(), toppings()] as const}
            fallback={<div>Please select a pizza and toppings</div>}
        >
            {([pizza, toppings]) => {
                <ShowPizza item={pizza} />
                <ShowToppings item={toppings} /> 
            }}
        </Show>
        <OtherStuff />
    </>
});
```

**TypeScript remark:** if you return an array to `Show.when` and want to get those same values within the callback with correct typings, you will have to add `as const` after the array. Otherwise, in the example above, TypeScript won't be able to know which item of the array is a `Pizza` and which item is a `Toppings`.

### `For` component
In the same way as `Show` for conditionals, Quarky provides a custom `For` component, to iterate over values. It is especially useful when combined with [`QuarkArray`](#quarkarray) and [`QuarkIter`](#quarkiter).

```tsx
interface Props {
    library: QuarkIter<Library>
}

interface Library {
    books: QuarkArray<Book>
}

interface Book {
    id: number,
    title: string
}

const ShowBooks = watchDependencies((props: Props) => {
    // make sure to get the quarks
    const books = library
        .map(x => x.books.quarks())
        .flatten();
    return (
        <OtherStuff />
        <For each={() => books.toArray()}>
            {(book: Quark<book>) =>
                <DisplayBook 
                    key={reactKey(book, 'id')}
                    book={book}
                />
            }
        </For>
        <OtherStuff />
    )
});
```

Here, if books are added or removed from a library, only the `For` component will rerender. If any of the books are modified, only the corresponding `DisplayBook` component will rerender.

`reactKey` is a helper to get a unique key from a Quark. If an ID key is provided, it will use an untracked read to retrieve

## Best practices
[WIP]

If you are using Quarky outside an existing integration, you should have some sort of subscription going on to the signals you use. We showed an example of [syncing quarks with external storage](#effects) earlier. This restriction is what allows Quarky to ensure quarks and derivations are freed from memory automatically once they are not used.

## React integration
- watchDependencies
- Quarks are referentially stable, quark setters too
- Control flow components
- General philosophy

## Bonus features

### QuarkArray

### QuarkIter
- Quarks are referentially stable
- SelectQuark
- QuarkArray + QuarkIter

## Best practices

## Details
- Storing functions in quarks
- Quarks and derivations are automatically collected from memory once they are not used

## Comparison with Recoil or Jotai
TODO