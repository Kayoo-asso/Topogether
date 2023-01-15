import React, { useState } from "react";
import { BoulderData, LightTopo, Topo, TopoData, TrackData } from "types";
import Download from "assets/icons/download.svg";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal";
import { api } from "helpers/services";
import { RoundProgressBar } from "./RoundProgressBar";
import { watchDependencies } from "helpers/quarky";
import { downloads } from "helpers/downloads/DownloadManager";

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
		console.log("Topo download state:", dlState);

		const download = async () => {
			// TODO: handle errors
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
				{dlState.status !== "downloading" && (
					<Download
						className={
							"ml-5 md:cursor-pointer" +
							(dlState.status === "downloaded"
								? "h-5 w-5 stroke-main"
								: "h-5 w-5 stroke-dark") +
							(props.className ? " " + props.className : "")
						}
						onClick={() => {
							if (dlState.status === "downloaded") showModalUndownload();
							else download();
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
