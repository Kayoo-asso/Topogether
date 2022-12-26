import { useProgressBar } from "helpers/hooks";
import { downloadTopo } from "helpers/services/downloadTopo";
import { useEffect } from "react";
import { TopoData } from "types";

interface DownloadTesterProps {
	topo: TopoData;
}

export function DownloadTester({ topo }: DownloadTesterProps) {
	const [progress, tracker] = useProgressBar(0.01);
	useEffect(() => {
		downloadTopo(topo, tracker);
	}, []);
	return null;
}
