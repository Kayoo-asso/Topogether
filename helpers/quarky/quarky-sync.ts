import { batch, registerPostUpdateHook } from ".";
import { getBroadcaster } from "./BroadcastChannel";
import { quark, Quark, isSSR } from "./quarky";

export interface SyncQuark<T> extends Quark<T> {
    readonly id: string,
}

interface QuarkyMessage {
    senderId: number,
    changes: [string, any][],
}

const Broadcaster = getBroadcaster<QuarkyMessage>("quarky");
let Changes: [string, any][] = [];
let Scheduled = false;
let BlockMessages = false;

registerPostUpdateHook(flushChanges);

function flushChanges() {
    const changes = Changes;
    Changes = [];
    if (!BlockMessages) {
        Broadcaster.postMessage({
            senderId: TabId,
            changes
        });
    }
    BlockMessages = false;
}

// TODO: better ID generation scheme
const max31BitSignedInteger = 1073741823; // 2^30 - 1
const TabId = (Math.random() * max31BitSignedInteger) | 0;

Broadcaster.onmessage = (message) => {
    BlockMessages = true;
    batch(() => {
        for (let i = 0; i < message.changes.length; ++i) {
            const [key, value] = message.changes[i];
            // TODO: wrap functions?
            const q = syncedQuarks.get(key);
            if (q) {
                q.set(value);
            }
        }
    });
}

const syncedQuarks: Map<string, SyncQuark<any>> = new Map();

export function syncQuark<T>(id: string, initial: T): SyncQuark<T> {
    if (isSSR) {
        const q = quark(initial) as any;
        q.id = id;
        return q;
    }

    let q = syncedQuarks.get(id);
    if (q) {
        q.set(initial);
    } else {
        const onChange = (value: T) => Changes.push([id, value]);
        // TypeScript struggles with adding a new property onto an existing interface
        q = quark(initial, { onChange }) as SyncQuark<T>;
        (q as any).id = id;
        syncedQuarks.set(id, q);
        Changes.push([id, initial]);
        if (!Scheduled) {
            Scheduled = true;
            queueMicrotask(flushChanges);
        }
    }
    return q;
}