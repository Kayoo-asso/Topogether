import React, { useState } from "react";
import { watchDependencies } from "helpers/quarky";
import { UUID } from "types";
import { useSession} from "helpers/services";
import { TracksList } from "./TracksList";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { useModal } from "helpers/hooks/useModal";
import { BoulderPreviewDesktop } from "components/molecules/BoulderPreview.desktop";
import { Button } from "components/atoms/buttons/Button";
import { Flash } from "components/atoms/overlays/Flash";
import { LoginForm } from "../user/LoginForm";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";

import Rock from "assets/icons/rock.svg";


interface BoulderContentDesktopProps {
	topoCreatorId: UUID;
}

export const BoulderContentDesktop: React.FC<BoulderContentDesktopProps> =
	watchDependencies((props: BoulderContentDesktopProps) => {
		const session = useSession();
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value();
		const flush = useSelectStore(s => s.flush);

		const [flashMessage, setFlashMessage] = useState<string>();
		const [officialTrackTab, setOfficialTrackTab] = useState(true);

		const [ModalLogin, showModalLogin, hideModalLogin] = useModal();

		return (
			<>
				<div>

					<ItemsHeaderButtons item={boulder} onClose={flush.item} />

					<BoulderPreviewDesktop />

					<div className="px-5">
						<div className="mb-2 flex flex-row items-end">
							<Rock className="h-7 w-7" />
							<span className={"ktext-big-title ml-3" + (boulder.name.length > 16 ? " text-base" : "")}>{boulder.name}</span>
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
				</div>
				

				<div className="ktext-label my-2 mt-10 flex flex-row justify-between px-5 font-bold">
					<span
						className={`md:cursor-pointer ${
							officialTrackTab ? "text-main" : "text-grey-medium"
						}`}
						onClick={() => setOfficialTrackTab(true)}
					>
						officielles
					</span>
					<span
						className={`md:cursor-pointer ${
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
