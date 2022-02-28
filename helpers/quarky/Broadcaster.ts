// // TODO: 
// // - localStorage broadcaster
// // - use IDs to prevent NativeBroadcaster from handling its own messages
// // - options
// // - add warning if no sync is possible (= no BroadcastChannel or localStorage fails)
// // - verify that closing the leader tab results in another tab being selected

// const LISTENERS_KEY = "__QUARKY_LISTENERS_NB__";
// const MESSAGE_COUNT_KEY = "__QUARKY_MESSAGE_COUNT__";
// const KEY_PREFIX = "__QUARKY_";

// const Broadcasters: Map<string, Broadcaster<any>> = new Map();

// export function getBroadcaster<T>(name: string): Broadcaster<T> {
//     if (typeof window === "undefined") return {
//         name,
//         close: () => { },
//         postMessage: () => { },
//         onmessage: null
//     };
//     let broadcaster: Broadcaster<T> | undefined = Broadcasters.get(name);
//     if (!broadcaster) {
//         broadcaster = new NativeBroadcaster<T>(name);
//         Broadcasters.set(name, broadcaster);
//     }
//     return broadcaster;
// }


// export class NativeBroadcaster<T> implements Broadcaster<T> {
//     readonly name: string;

//     readonly channel: BroadcastChannel;
//     isClosed: boolean = false;
//     onmessage: MessageHandler<T> | null = null;

//     constructor(name: string) {
//         this.name = name;
//         // TODO: better ID generation
//         this.channel = new BroadcastChannel(name);
//         // TODO: check if we need to bind `this`
//         this.channel.addEventListener("message", (ev: MessageEvent<T>) => {
//             if (this.onmessage) {
//                 this.onmessage(ev.data);
//             }            
//         });
//         this.channel.onmessage
//     }

//     postMessage(message: T) {
//         this.channel.postMessage(message);
//     }

//     close() {
//         this.channel.close();
//     }
// }

// /**
//  * copied from crosstab
//  * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
//  */
// export function getLocalStorage() {
//     let localStorage;
//     if (typeof window === 'undefined') return null;
//     try {
//         localStorage = window.localStorage;
//         // localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
//     } catch (e) {
//         // New versions of Firefox throw a Security exception
//         // if cookies are disabled. See
//         // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
//     }
//     return localStorage;
// }

// // function getCount(key: string): number {
// //     const val = localStorage.getItem(key);
// //     return val ? +val : 0;
// // }

// // function setCount(key: string, count: number) {
// //     localStorage.setItem(key, "" + count);
// // }
// // class LocalStorageBroadcaster<T> implements Broadcaster<T> {
// //     readonly name: string;
// //     onmessage: MessageHandler<T> | null = null;

// //     private readonly prefix: string;
// //     private someoneIsListening: boolean = false;
// //     private msgCount: number;

// //     constructor(name: string) {
// //         this.name = name;
// //         this.prefix = KEY_PREFIX + name;
// //         this.id = getCount(LISTENERS_KEY);
// //         this.msgCount = getCount(MESSAGE_COUNT_KEY);

// //         setCount(LISTENERS_KEY, this.id + 1);
// //         if (this.id > 0) {
// //             this.someoneIsListening = true;
// //         } else {
// //             setCount(MESSAGE_COUNT_KEY, 0);
// //         }


// //         addEventListener("storage", this.onStorage.bind(this));
// //         addEventListener("beforeunload", (ev) => {

// //         });
// //         // todo: before unload
// //     }

// //     // TODO: actual leader information
// //     private onStorage(ev: StorageEvent) {
// //         console.log("Received storage event ", ev);
// //         if (ev.key === LISTENERS_KEY) {
// //             this.someoneIsListening = true; 
// //         }
// //         else if (ev.key?.startsWith(this.prefix)) {
// //             // const messageCount = ev.key.substring(this.prefix.length);
// //             // if (+messageCount !== this.msgCount) throw new Error("There has been an error synchronising message counts across local storage");
// //             this.msgCount += 1;
// //             if (this.onmessage && ev.newValue) {
// //                 this.onmessage(JSON.parse(ev.newValue));
// //             }
// //         }
// //     }

// //     postMessage(message: T) {
// //         console.log("Posting message to local storage. someoneIsListening: ", true);
// //         if (this.someoneIsListening) {
// //             const val = JSON.stringify(message);
// //             const key = this.prefix + this.msgCount;
// //             this.msgCount += 1;
// //             localStorage.setItem(key, val);
// //         }
// //     }

// //     close() {
// //         throw new Error("TODO");
// //     }
// // }

// interface Broadcaster<T> {
//     readonly name: string;
//     postMessage(message: T): void;
//     close(): void;
//     onmessage: MessageHandler<T> | null;
// }

// export type MessageHandler<T> = (message: T) => void;