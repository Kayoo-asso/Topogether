import { ProgressTracker } from "helpers/hooks";
import type { TopoDownloadMessage } from "./downloadTopo";
import type { UUID } from "types";

declare let self: SharedWorkerGlobalScope;

export type DownloadWorkerMessage = {
	id: UUID,
	type: "download",
	progress: number
} | {
	id: UUID,
	type: "download_success"
} | {
	id: UUID,
	type: "download_error"
}



const downloads: Map<string, ProgressTracker> = new Map();

self.addEventListener("connect", (ev) => {
	console.log("Connect event from Topogether. Ports =", ev.ports);
	for (const port of ev.ports) {
		port.addEventListener(
			"message",
			(ev: MessageEvent<TopoDownloadMessage>) => {
				const topo = ev.data.topo;
				console.log("Download request for topo:", topo);
				port.postMessage({ id: topo.id });
			}
		);
		port.start();
	}
});
