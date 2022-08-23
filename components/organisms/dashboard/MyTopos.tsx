import React, { useCallback, useState } from "react";
import { AddTopoCard, TopoCardList, Button } from "components";
import { LightTopo, TopoStatus } from "types";
import { UserActionDropdown } from "components/molecules/cards/UserActionDropdown";
import { api } from "helpers/services";
import { watchDependencies } from "helpers/quarky";
import AddIcon from "assets/icons/add.svg";
import Link from "next/link";
import { staticUrl } from "helpers/constants";
import { useModal, useContextMenu } from "helpers/hooks";
import { encodeUUID } from "helpers/utils";
import { useRouter } from "next/router";
import { TopoPreview } from "components/organisms/TopoPreview";

interface MyToposProps {
	myTopos: LightTopo[];
	pageRef: React.RefObject<HTMLDivElement>;
}

export const MyTopos: React.FC<MyToposProps> = watchDependencies(
	(props: MyToposProps) => {
		const router = useRouter();
		const [lightTopos, setLightTopos] = useState(props.myTopos);
		const draftLightTopos = lightTopos.filter(
			(topo) => topo.status === TopoStatus.Draft
		);
		const submittedLightTopos = lightTopos.filter(
			(topo) => topo.status === TopoStatus.Submitted
		);
		const validatedLightTopos = lightTopos.filter(
			(topo) => topo.status === TopoStatus.Validated
		);

		const [actionTopo, setActionTopo] = useState<LightTopo>();

		const [previewTopo, setPreviewTopo] = useState<LightTopo>();
		const togglePreviewTopo = useCallback((topo: LightTopo) => {
			if (previewTopo && previewTopo.id === topo.id) setPreviewTopo(undefined);
			else {
				setActionTopo(topo);
				setPreviewTopo(topo);
			}
		}, [previewTopo]);

		
		const [dropdownPosition, setDropdownPosition] = useState<{
			x: number;
			y: number;
		}>();

		const [ModalDelete, showModalDelete] = useModal();
		const [ModalSubmit, showModalSubmit] = useModal();
		const [ModalUnsubmit, showModalUnsubmit] = useModal();

		const submitTopo = useCallback(async () => {
			if (actionTopo) {
				await api.setTopoStatus(actionTopo.id, TopoStatus.Submitted);
				const submittedTopo = lightTopos.find((lt) => lt.id === actionTopo.id)!;
				submittedTopo.submitted = new Date().toISOString();
				submittedTopo.status = TopoStatus.Submitted;
				setLightTopos(lightTopos.slice());
			}
			setPreviewTopo(undefined);
		}, [actionTopo, lightTopos]);

		const unsubmitTopo = useCallback(async (openTopo?: boolean) => {
			if (actionTopo) {
				await api.setTopoStatus(actionTopo.id, TopoStatus.Draft);
				const toDraftTopo = lightTopos.find((lt) => lt.id === actionTopo.id)!;
				toDraftTopo.submitted = undefined;
				toDraftTopo.status = TopoStatus.Draft;
				setLightTopos(lightTopos.slice());
				setPreviewTopo(undefined);
				if (openTopo) router.push("/builder/" + encodeUUID(actionTopo.id));
			}
		}, [actionTopo, lightTopos]);

		const deleteTopo = useCallback(() => {
			if (actionTopo) {
				const newLightTopos = lightTopos.filter((lt) => lt.id !== actionTopo.id);
				api.deleteTopo(actionTopo);
				setLightTopos(newLightTopos);
			}
			setPreviewTopo(undefined);
		}, [actionTopo, lightTopos]);

		useContextMenu(() => setDropdownPosition(undefined), props.pageRef.current);
		const onContextMenu = useCallback(
			(t: LightTopo, position: { x: number; y: number }) => {
				setActionTopo(t)
				setDropdownPosition(position);
			},
			[props.pageRef]
		);

		return (
			<>
				<div className="flex items-center justify-between px-4 py-6 md:px-8">
					<div className="ktext-section-title text-center md:hidden">
						Mes topos
					</div>
					{lightTopos.length > 0 && (
						<Button content="Créer un topo" href="/builder/new" />
					)}
				</div>
				
				{lightTopos.length > 0 && (
					<>
						<TopoCardList
							topos={draftLightTopos}
							status={TopoStatus.Draft}
							title={
								<div className="ktext-section-title px-4 text-second-light md:px-8">
									Brouillons
								</div>
							}
							lastCard={<AddTopoCard />}
							onClick={togglePreviewTopo}
							onContextMenu={onContextMenu}
						/>

						<TopoCardList
							topos={submittedLightTopos}
							status={TopoStatus.Submitted}
							title={
								<div className="ktext-section-title px-4 text-third-light md:px-8">
									En attente de validation
								</div>
							}
							onClick={togglePreviewTopo}
							onContextMenu={onContextMenu}
						/>

						<TopoCardList
							topos={validatedLightTopos}
							status={TopoStatus.Validated}
							title={
								<div className="ktext-section-title px-4 text-main md:px-8">
									Validés
								</div>
							}
							onClick={togglePreviewTopo}
							onContextMenu={onContextMenu}
						/>
					</>
				)}
				{lightTopos.length === 0 && (
					<div className="relative flex h-[70vh] w-full justify-center">
						<div className="relative flex h-full w-[90%] items-center overflow-hidden rounded bg-grey-superlight">
							<Link href="/builder/new">
								<a className="flex w-full flex-col items-center">
									<AddIcon className="h-16 w-16 fill-white stroke-grey-medium stroke-[0.25px]" />
									<span>Créer un topo</span>
								</a>
							</Link>
						</div>
					</div>
				)}

				{previewTopo && previewTopo.status === TopoStatus.Draft &&
					<TopoPreview
						topo={previewTopo}
						displayLastDate
						mainButton={{ content: 'Modifier', link: '/builder/' + encodeUUID(previewTopo.id) }}
						secondButton={{ content: 'Valider', onClick: showModalSubmit, color: 'main' }}
						thirdButton={{ content: 'Supprimer', onClick: showModalDelete, color: 'red' }}
						onClose={() => setPreviewTopo(undefined)}
					/>
				}
				{previewTopo && previewTopo.status === TopoStatus.Submitted &&
					<TopoPreview
						topo={previewTopo}
						displayLastDate
						mainButton={{ content: 'Voir le topo', link: '/topo/' + encodeUUID(previewTopo.id) }}
						secondButton={{ content: 'Modifier', onClick: showModalUnsubmit }}
						thirdButton={{ content: 'Supprimer', onClick: showModalDelete, color: 'red' }}
						onClose={() => setPreviewTopo(undefined)}
					/>
				}
				{previewTopo && previewTopo.status === TopoStatus.Validated &&
					<TopoPreview
						topo={previewTopo}
						displayLastDate
						mainButton={{ content: 'Ouvrir', link: '/topo/' + encodeUUID(previewTopo.id) }}
						secondButton={{ content: 'Supprimer', onClick: showModalDelete, color: 'red' }}
						onClose={() => setPreviewTopo(undefined)}
					/>
				}
				

				{actionTopo && dropdownPosition && (
					<UserActionDropdown
						position={dropdownPosition}
						topo={actionTopo}
						onSendToDraftClick={showModalUnsubmit}
						onSendToValidationClick={showModalSubmit}
						onDeleteClick={showModalDelete}
						onSelect={() => {
							setDropdownPosition(undefined);
						}}
					/>
				)}
				<ModalSubmit
					buttonText="Confirmer"
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={submitTopo}
				>
					Le topo sera envoyé en validation. Etes-vous sûr de vouloir continuer
					?
				</ModalSubmit>
				<ModalUnsubmit
					buttonText="Confirmer"
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={() => unsubmitTopo(true)}
				>
					Le topo retournera en brouillon avant de pouvoir être modifié. Etes-vous sûr de vouloir continuer ?
				</ModalUnsubmit>
				<ModalDelete
					buttonText="Supprimer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={deleteTopo}
				>
					Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer
					?
				</ModalDelete>
			</>
		);
	}
);

MyTopos.displayName = 'MyTopos';