import { ProgressTracker, useProgressBar } from "helpers/hooks";
import { downloadTopo } from "helpers/services/downloadTopo";
import { useEffect } from "react";
import { TopoData } from "types";

interface DownloadTesterProps {
	topo: TopoData;
}

async function test(topo: TopoData) {
  const result = await downloadTopo(topo);
  if(!result.success) {
    console.log("Errors while downloading:", result);
  }
  else console.log(result);
}


export function DownloadTester({ topo }: DownloadTesterProps) {
	const progress  = useProgressBar(topo.id);
	useEffect(() => {
    if(progress === undefined) {
      test(topo)
    }
	}, []);
  console.log("Progress:", progress);
	return null;
}
