import React, { useState } from "react";
import { LightTopo, Topo } from "types";
import Download from "assets/icons/download.svg";
import { api } from "helpers/services";
import { staticUrl } from "helpers/constants";
import { useModal } from "helpers/hooks/useModal";
import { Loading } from "./Loading";

interface DownloadButtonProps {
	downloaded?: boolean;
	className?: string;
	topo: Topo | LightTopo;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
	downloaded = false,
	...props
}: DownloadButtonProps) => {
	const [ModalUndownload, showModalUndownload] = useModal();
	const [loading, setLoading] = useState<boolean>(false);

	const toggle = async () => {
		// if (downloaded) showModalUndownload();
		// else {
		// 	setLoading(true);
		// 	await api.downloadTopo(props.topo.id);
		// 	setLoading(false);
		// }
	};

	return (
		<>
			{loading && <Loading SVGClassName="h-5 w-5" />}
			{!loading && (
				<Download
					className={
						"cursor-pointer " +
						(downloaded ? "h-5 w-5 stroke-main" : "h-5 w-5 stroke-dark") +
						(props.className ? " " + props.className : "")
					}
					onClick={toggle}
				/>
			)}

			<ModalUndownload
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={() => alert("à venir")} //TODO
			>
				Le topo ne sera plus accessible hors ligne.
			</ModalUndownload>
		</>
	);
};
