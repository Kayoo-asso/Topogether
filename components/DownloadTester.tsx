import { ProgressTracker, useProgressBar } from "helpers/hooks";
import { downloadTopo } from "helpers/services/downloadTopo";
import { useEffect } from "react";
import { TopoData } from "types";

interface DownloadTesterProps {
	topo: TopoData;
}

async function test(topo: TopoData, tracker: ProgressTracker) {
  const result = await downloadTopo(topo, tracker);
  if(!result.success) {
    console.log("Errors while downloading:", result);
  }
}


export function DownloadTester({ topo }: DownloadTesterProps) {
	const [progress, tracker] = useProgressBar(0.01);
	useEffect(() => {
    test(topo, tracker)
	}, []);
	return null;
}
