import { ProgressTracker, useProgressBar } from "helpers/hooks";
import {
	TopoDownloadMessage,
	downloadTopo,
	getWorker,
} from "helpers/services/downloadTopo";
import { useEffect } from "react";
import { TopoData } from "types";

interface DownloadTesterProps {
	topo: TopoData;
}

async function test(topo: TopoData) {
	const result = await downloadTopo(topo);
	if (!result.status) {
		console.log("Errors while downloading:", result);
	} else console.log("Download success");
}

export function DownloadTester({ topo }: DownloadTesterProps) {
	const progress = useProgressBar(topo.id);
	useEffect(() => {
		const worker = getWorker();
		console.log("Worker:", worker);
		const onmessage = (ev: MessageEvent<any>) =>
			console.log("Message from worker:", ev.data);
		worker.port.onmessage = onmessage
		// worker.port.addEventListener("message", onmessage);
		// worker.port.start();
		worker.port.postMessage({
			topo: topo,
		});

		return () => {
			worker.port.removeEventListener("message", onmessage);
		}
	});
	useEffect(() => {
		if(progress === undefined) {
		  test(topo)
		}
	}, []);
	console.log("Progress:", progress);
	return null;
}
