import React, { useState } from "react";
import { LightTopo, Topo } from "types";
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

export const DownloadButton: React.FC<DownloadButtonProps> = watchDependencies(
	(props: DownloadButtonProps) => {
		const [ModalUndownload, showModalUndownload] = useModal();
		const dlState = downloads.getState(props.topo.id);
		console.log("Topo download state:", dlState);

		const download = async () => {
			// TODO: handle errors
			let topo = isLight(props.topo)
				? await api.getTopo(props.topo.id)
				: props.topo;
			if (topo) await downloads.cacheTopo(topo);
			else alert("Le topo est introuvable...");
		};

		return (
			<>
				{dlState.status === "downloading" && (
					<RoundProgressBar
						percentage={dlState.progress}
						displayLabel={false}
						onClick={showModalUndownload}
					/>
				)}
				{dlState.status !== "downloading" && (
					<Download
						className={
							"ml-5 cursor-pointer " +
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
