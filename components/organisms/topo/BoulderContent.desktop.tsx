import React, { useState } from "react";
import {
	BoulderPreviewDesktop,
	Button,
} from "components";
import { watchDependencies } from "helpers/quarky";
import { UUID } from "types";
import { LoginForm } from "..";
import { useSession} from "helpers/services";
import { useModal } from "helpers/hooks";

import Rock from "assets/icons/rock.svg";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { TracksList } from "./TracksList";
import { Flash } from "components/atoms/overlays";

interface BoulderContentDesktopProps {
	topoCreatorId: UUID;
}

export const BoulderContentDesktop: React.FC<BoulderContentDesktopProps> =
	watchDependencies((props: BoulderContentDesktopProps) => {
		const session = useSession();
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value()

		const [flashMessage, setFlashMessage] = useState<string>();
		const [officialTrackTab, setOfficialTrackTab] = useState(true);

		const [ModalLogin, showModalLogin, hideModalLogin] = useModal();

		return (
			<>
				<div className="px-5">
					<div className="mb-2 flex flex-row items-end">
						<Rock className="h-7 w-7 stroke-main" />
						<span className={"ktext-big-title ml-3" + (boulder.name.length > 16 ? " text-base" : "")}>{boulder.name}</span>
					</div>
					<div
						className="ktext-label cursor-pointer text-grey-medium"
						onClick={() => {
							const data = [
								new ClipboardItem({
									"text/plain": new Blob(
										[boulder.location[1] + "," + boulder.location[0]],
										{
											type: "text/plain",
										}
									),
								}),
							];
							navigator.clipboard.write(data).then(
								function () {
									setFlashMessage(
										"Coordonnées copiées dans le presse papier."
									);
								},
								function () {
									setFlashMessage("Impossible de copier les coordonées.");
								}
							);
						}}
					>
						{parseFloat(boulder.location[1].toFixed(12)) +
							"," +
							parseFloat(boulder.location[0].toFixed(12))}
					</div>
					{boulder.isHighball && (
						<div className="ktext-label text-grey-medium">High Ball</div>
					)}
					{boulder.mustSee && (
						<div className="ktext-label mb-15 text-grey-medium">
							Incontournable !
						</div>
					)}
				</div>
				<div className="mt-3">
					<BoulderPreviewDesktop />
				</div>

				<div className="ktext-label my-2 mt-10 flex flex-row justify-between px-5 font-bold">
					<span
						className={`cursor-pointer ${
							officialTrackTab ? "text-main" : "text-grey-medium"
						}`}
						onClick={() => setOfficialTrackTab(true)}
					>
						officielles
					</span>
					<span
						className={`cursor-pointer ${
							!officialTrackTab ? "text-main" : "text-grey-medium"
						}`}
						onClick={() => setOfficialTrackTab(false)}
					>
						communautés
					</span>
				</div>

				<div className="overflow-auto">
					<TracksList
						official={officialTrackTab}
						topoCreatorId={props.topoCreatorId}
					/>
				</div>
				{!officialTrackTab && (
					<div className="mt-4 flex flex-col items-center px-5">
						<Button
							content="Ajouter une voie"
							fullWidth
							onClick={() => {
								if (session) alert("à venir"); //TODO
								else showModalLogin();
							}}
						/>
					</div>
				)}

				<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
					{flashMessage}
				</Flash>

				<ModalLogin>
					<div className="mt-4 p-8">
						<div className="mb-8 text-center">
							Pour ajouter une voie "Communauté", vous devez être connecté.
						</div>
						<LoginForm onLogin={() => hideModalLogin()} />
					</div>
				</ModalLogin>
			</>
		);
	});

	BoulderContentDesktop.displayName = "BoulderContentDesktop";
