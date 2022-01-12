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

In the above example, the effect will remain active forever and keep the quark alive in memory as well. This is a memory leak, exactly the same as if you had forgotten an event listener somewhere. To fix it, we can do the following:

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


### Updates, batching and untracking


To avoid unnecessary work, derivations that are not used directly or indirectly by any effect are *inactive*: they will not be automatically updated and will be recomputed upon every read. Only derivations used by effects or other active derivations receive updates. For example, in React, your components subscribe to the signals they use 

### Equality checks

## Best practices

## React integration
- watchDependencies
- Quarks are referentially stable, quark setters too
- Control flow components
- General philosophy

## Bonus features
- Quarks are referentially stable
- SelectQuark
- QuarkArray + QuarkIter

## Best practices

## Details
- Storing functions in quarks
- Quarks and derivations are automatically collected from memory once they are not used

## Comparison with Recoil or Jotai
TODO