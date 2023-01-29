import React from "react";
import { BoulderData, LightTopo, Topo, TopoData, TrackData } from "types";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal";
import { api } from "helpers/services";
import { RoundProgressBar } from "./RoundProgressBar";
import { watchDependencies } from "helpers/quarky";
import { downloads } from "helpers/downloads/DownloadManager";

import Download from "assets/icons/download.svg";
import Check from "assets/icons/checked.svg";

interface DownloadButtonProps {
	className?: string;
	topo: Topo | LightTopo;
}

const isLight = (topo: Topo | LightTopo): topo is LightTopo => {
	return (topo as LightTopo).nbBoulders !== undefined;
};
const topo2TopoData = (t: Topo) => {
	const bds: BoulderData[] = t.boulders.toArray().map(b => ({
		...b,
		liked: b.liked(),
		tracks: b.tracks.toArray().map(t => ({
			...t,
			ratings: t.ratings.toArray(),
			lines: t.lines.toArray(),
		})) as TrackData[],
	}))
	const td: TopoData = {
		...t,
		liked: t.liked(),
		sectors: t.sectors.toArray(),
		boulders: bds,
		waypoints: t.waypoints.toArray(),
		parkings: t.parkings.toArray(),
		accesses: t.accesses.toArray(),
		managers: t.managers.toArray(),
		contributors: t.contributors.toArray()
	};
	return td;
}

export const DownloadButton: React.FC<DownloadButtonProps> = watchDependencies(
	(props: DownloadButtonProps) => {
		const [ModalUndownload, showModalUndownload] = useModal();
		const dlState = downloads.getState(props.topo.id);
		// console.log("Topo download state:", dlState);

		const download = async () => {
			let topo = isLight(props.topo)
				? await api.getTopo(props.topo.id)
				: topo2TopoData(props.topo);
			if (topo) await downloads.cacheTopo(topo);
			else alert("Le topo est introuvable...");
		};

		return (
			<>
				{dlState.status === "downloading" && (
					<RoundProgressBar
						percentage={dlState.progress*100}
						displayLabel={false}
						onClick={showModalUndownload}
					/>
				)}

				{dlState.status === "downloaded" && (
					<div 
						className="relative px-3 py-3 bg-main rounded-full md:cursor-pointer"
						onClick={(e) => {
							e.preventDefault(); e.stopPropagation();
							showModalUndownload();
						}}
					>
						<Check className="absolute w-3 h-3 stroke-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
					</div>
				)}

				{dlState.status !== "downloading" && dlState.status !== "downloaded" && (
					<Download
						className={
							"h-5 w-5 stroke-main stroke-[1.5px] md:cursor-pointer " +
							(props.className ? props.className : "")
						}
						onClick={(e) => {
							e.preventDefault(); e.stopPropagation();
							download();
						}}
					/>
				)}

				<ModalUndownload
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={() => {
						downloads.delete(props.topo.id);
					}}
				>
					Le topo ne sera plus accessible hors ligne.
				</ModalUndownload>
			</>
		);
	}
);
