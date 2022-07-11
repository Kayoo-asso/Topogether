export {};
// import { batch, registerPostUpdateHook } from ".";
// // import { getBroadcaster } from "./Broadcaster";
// import { quark, Quark, isSSR } from "./quarky";

// export interface SyncQuark<T, Serializable = T> extends Quark<T> {
//     readonly id: string,
//     readonly export?: (value: T) => Serializable,
//     readonly import?: (message: Serializable, current: T) => T,
// }

// export interface SyncQuarkOptions<T, Serializable = T> {
//     export: (value: T) => Serializable,
//     import: (message: Serializable, current: T) => T,
// }

// interface QuarkyMessage {
//     senderId: number,
//     changes: [string, any][],
// }

// // const Broadcaster = getBroadcaster<QuarkyMessage>("quarky");
// let Changes: [string, any][] = [];
// let Scheduled = false;
// let BlockMessages = false;

// // registerPostUpdateHook(flushChanges);

// // function flushChanges() {
// //     const changes = Changes;
// //     Changes = [];
// //     if (!BlockMessages) {
// //         Broadcaster.postMessage({
// //             senderId: TabId,
// //             changes
// //         });
// //     }
// //     BlockMessages = false;
// // }

// // TODO: better ID generation scheme
// const max31BitSignedInteger = 1073741823; // 2^30 - 1
// const TabId = (Math.random() * max31BitSignedInteger) | 0;

// // Broadcaster.onmessage = (message) => {
// //     BlockMessages = true;
// //     batch(() => {
// //         for (let i = 0; i < message.changes.length; ++i) {
// //             const [key, value] = message.changes[i];
// //             // TODO: wrap functions?
// //             const q = syncedQuarks.get(key);
// //             if (q) {
// //                 if (q.import) {
// //                     q.set((x: any) => q.import!(value, x));
// //                 } else {
// //                     q.set(value);
// //                 }
// //             }
// //         }
// //     });
// // }

// const syncedQuarks: Map<string, SyncQuark<any>> = new Map();

// export function syncQuark<T, Message = T>(id: string, initial: T, options?: SyncQuarkOptions<T, Message>): SyncQuark<T> {
//     if (isSSR) {
//         const q = quark(initial) as any;
//         q.id = id;
//         return q;
//     }

//     let q = syncedQuarks.get(id) as any;
//     if (q) {
//         q.set(initial);
//     } else {
//         const onChange = options
//             ? (value: T) => Changes.push([id, options.export(value)])
//             : (value: T) => Changes.push([id, value]);
//         // TypeScript struggles with adding a new property onto an existing interface
//         q = quark(initial, { onChange }) as any;
//         q.id = id;
//         q.import = options?.import;
//         q.export = options?.export;

//         syncedQuarks.set(id, q);
//         onChange(initial);

//         if (!Scheduled) {
//             Scheduled = true;
//             // queueMicrotask(flushChanges);
//         }
//     }
//     return q;
// }
