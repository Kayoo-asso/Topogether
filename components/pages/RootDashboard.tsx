import React, { useCallback, useRef, useState } from "react";
import { AddTopoCard, TopoCardList, Button } from "components";
import { LightTopo, TopoStatus } from "types";
import { UserActionDropdown } from "components/molecules/cards/UserActionDropdown";
import { api } from "helpers/services";
import { watchDependencies } from "helpers/quarky";
import AddIcon from "assets/icons/add.svg";
import Link from "next/link";
import { HeaderDesktop } from "components/layouts/HeaderDesktop";
import { LeftbarDesktop } from "components/layouts/Leftbar.desktop";
import { staticUrl } from "helpers/constants";
import { useModal, useContextMenu } from "helpers/hooks";

interface RootDashboardProps {
	lightTopos: LightTopo[];
}

export const RootDashboard: React.FC<RootDashboardProps> = watchDependencies(
	(props: RootDashboardProps) => {
		const [lightTopos, setLightTopos] = useState(props.lightTopos);
		const draftLightTopos = lightTopos.filter(
			(topo) => topo.status === TopoStatus.Draft
		);
		const submittedLightTopos = lightTopos.filter(
			(topo) => topo.status === TopoStatus.Submitted
		);
		const validatedLightTopos = lightTopos.filter(
			(topo) => topo.status === TopoStatus.Validated
		);

		const ref = useRef<HTMLDivElement>(null);
		const [topoDropdown, setTopoDropdown] = useState<LightTopo>();
		const [dropdownPosition, setDropdownPosition] = useState<{
			x: number;
			y: number;
		}>();

		const [ModalDelete, showModalDelete] = useModal();
		const [ModalSubmit, showModalSubmit] = useModal();
		const [ModalUnsubmit, showModalUnsubmit] = useModal();

		const sendTopoToValidation = useCallback(async () => {
			if (topoDropdown) {
				await api.setTopoStatus(topoDropdown.id, TopoStatus.Submitted);
				const submittedTopo = lightTopos.find(
					(lt) => lt.id === topoDropdown.id
				)!;
				submittedTopo.submitted = new Date().toISOString();
				submittedTopo.status = TopoStatus.Submitted;
				setLightTopos(lightTopos.slice());
			}
		}, [topoDropdown, lightTopos]);

		const sendTopoToDraft = useCallback(async () => {
			if (topoDropdown) {
				await api.setTopoStatus(topoDropdown.id, TopoStatus.Draft);
				const toDraftTopo = lightTopos.find((lt) => lt.id === topoDropdown.id)!;
				toDraftTopo.submitted = undefined;
				toDraftTopo.status = TopoStatus.Draft;
				setLightTopos(lightTopos.slice());
			}
		}, [topoDropdown, lightTopos]);

		const deleteTopo = useCallback(() => {
			const newLightTopos = lightTopos.filter(
				(lt) => lt.id !== topoDropdown?.id
			);
			api.deleteTopo(topoDropdown!);
			setLightTopos(newLightTopos);
		}, [topoDropdown, lightTopos]);

		useContextMenu(() => setDropdownPosition(undefined), ref.current);
		const onContextMenu = useCallback(
			(topo: LightTopo, position: { x: number; y: number }) => {
				setTopoDropdown(topo);
				setDropdownPosition(position);
			},
			[ref]
		);

		return (
			<>
				<HeaderDesktop backLink="/" title="Mes topos" />

				<div className="flex h-content w-full flex-row md:h-full">
					<LeftbarDesktop currentMenuItem="BUILDER" />

					<div
						ref={ref}
						className="h-contentPlusHeader w-full overflow-y-auto overflow-x-hidden bg-white pl-[1%] pb-16 md:h-contentPlusShell"
					>
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
									clickable="builder"
									title={
										<div className="ktext-section-title px-4 text-second-light md:px-8">
											Brouillons
										</div>
									}
									lastCard={<AddTopoCard />}
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
									onContextMenu={onContextMenu}
								/>

								<TopoCardList
									topos={validatedLightTopos}
									status={TopoStatus.Validated}
									clickable="topo"
									title={
										<div className="ktext-section-title px-4 text-main md:px-8">
											Validés
										</div>
									}
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
					</div>
				</div>

				{topoDropdown && dropdownPosition && (
					<UserActionDropdown
						position={dropdownPosition}
						topo={topoDropdown}
						onSendToDraftClick={showModalUnsubmit}
						onSendToValidationClick={showModalSubmit}
						onDeleteClick={showModalDelete}
						onSelect={() => setDropdownPosition(undefined)}
					/>
				)}
				<ModalSubmit
					buttonText="Confirmer"
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={sendTopoToValidation}
				>
					Le topo sera envoyé en validation. Etes-vous sûr de vouloir continuer
					?
				</ModalSubmit>
				<ModalUnsubmit
					buttonText="Confirmer"
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={sendTopoToDraft}
				>
					Le topo retournera en brouillon. Etes-vous sûr de vouloir continuer ?
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
