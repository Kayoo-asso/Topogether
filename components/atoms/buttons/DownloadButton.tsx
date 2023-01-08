import React, { useState } from "react";
import { LightTopo, Topo } from "types";
import Download from "assets/icons/download.svg";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal";
import { Loading } from "./Loading";
import { useProgressBar } from "helpers/hooks";
import { downloadTopo, removeTopoFromCache, isAvailableOffline, useIsAvailableOffline } from "helpers/services/downloadTopo";
import { api } from "helpers/services";
import { RoundProgressBar } from "./RoundProgressBar";

interface DownloadButtonProps {
	className?: string;
	topo: Topo | LightTopo;
}

const isLight = (topo: Topo | LightTopo): topo is LightTopo => {
	return (topo as LightTopo).nbBoulders !== undefined;
  }

export const DownloadButton: React.FC<DownloadButtonProps> = (props: DownloadButtonProps) => {
	const [ModalUndownload, showModalUndownload] = useModal();
	const [loading, setLoading] = useState(false);
	const progress = useProgressBar(props.topo.id);
	const isDl = useIsAvailableOffline(props.topo.id);

	const download = async () => {
		setLoading(true);
		let topo = isLight(props.topo) ? await api.getTopo(props.topo.id) : props.topo;
		if (topo) await downloadTopo(topo);
		else alert("Le topo est introuvable...");
		setLoading(false);
	};

	return (
		<>
			{loading && 
				<RoundProgressBar 
					percentage={progress || 0}
					displayLabel={false}
					onClick={showModalUndownload}
				/>
			}
			{!loading && (
				<Download
					className={
						"cursor-pointer ml-5 " +
						(isDl ? "h-5 w-5 stroke-main" : "h-5 w-5 stroke-dark") +
						(props.className ? " " + props.className : "")
					}
					onClick={() => {
						if (isDl) showModalUndownload();
						else download();
					}}
				/>
			)}

			<ModalUndownload
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={() => {
					removeTopoFromCache(props.topo.id);
				}}
			>
				Le topo ne sera plus accessible hors ligne.
			</ModalUndownload>
		</>
	);
};
