import React, { useCallback, useRef, useState } from "react";
import { LightTopo, TopoStatus } from "types";
import { AdminActionDropdown } from "components/molecules/cards/AdminActionDropdown";
import { useContextMenu } from "helpers/hooks/useContextMenu";
import { api } from "helpers/services";
import { Header } from "components/layouts/Header";
import { LeftbarDesktop } from "components/layouts/Leftbar.desktop";
import { staticUrl } from "helpers/constants";
import Edit from "assets/icons/edit.svg";
import Recent from "assets/icons/recent.svg";
import Checked from "assets/icons/checked.svg";
import { encodeUUID } from "helpers/utils";
import { TopoPreview } from "components/organisms/TopoPreview";
import { TabsFly } from "components/layouts/TabsFly";
import { useModal } from "helpers/hooks/useModal";
import { TopoCard } from "components/molecules/cards/TopoCard";

interface RootAdminProps {
	lightTopos: LightTopo[];
}

export const RootAdmin: React.FC<RootAdminProps> = (props: RootAdminProps) => {
	const [selectedStatus, setSelectedStatus] = useState<TopoStatus>(
		TopoStatus.Draft
	);

	const [lightTopos, setLightTopos] = useState(props.lightTopos);
	const draftLightTopos = lightTopos.filter(
		(topo) => topo.status === TopoStatus.Draft
	).sort((t1, t2) => { return new Date(t2.modified).getTime() - new Date(t1.modified).getTime() });
	const submittedLightTopos = lightTopos.filter(
		(topo) => topo.status === TopoStatus.Submitted
	).sort((t1, t2) => { return new Date(t2.submitted!).getTime() - new Date(t1.submitted!).getTime() });
	const validatedLightTopos = lightTopos.filter(
		(topo) => topo.status === TopoStatus.Validated
	).sort((t1, t2) => { return new Date(t2.validated!).getTime() - new Date(t1.validated!).getTime() });

	const toposToDisplay = (selectedStatus === TopoStatus.Draft) ? draftLightTopos : (selectedStatus === TopoStatus.Submitted) ? submittedLightTopos : validatedLightTopos;

	const [actionTopo, setActionTopo] = useState<LightTopo>();

	const [previewTopo, setPreviewTopo] = useState<LightTopo>();
	const togglePreviewTopo = useCallback((topo: LightTopo) => {
		if (previewTopo && previewTopo.id === topo.id) setPreviewTopo(undefined);
		else {
			setActionTopo(topo);
			setPreviewTopo(topo);
		}
	}, [previewTopo]);

	const ref = useRef<HTMLDivElement>(null);
	const [dropdownPosition, setDropdownPosition] = useState<{
		x: number;
		y: number;
	}>();

	const [ModalSubmit, showModalSubmit] = useModal();
	const [ModalValidate, showModalValidate] = useModal();
	const [ModalUnvalidate, showModalUnvalidate] = useModal();
	const [ModalReject, showModalReject] = useModal();
	const [ModalDelete, showModalDelete] = useModal();

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
	const rejectTopo = useCallback(async () => {
		if (actionTopo) {
			await api.setTopoStatus(actionTopo.id, TopoStatus.Draft);
			const rejectedTopo = lightTopos.find((lt) => lt.id === actionTopo.id)!;
			rejectedTopo.submitted = undefined;
			rejectedTopo.status = TopoStatus.Draft;
			setLightTopos(lightTopos.slice());
		}
		setPreviewTopo(undefined);
	}, [actionTopo, lightTopos]);
	const validateTopo = useCallback(async () => {
		if (actionTopo) {
			await api.setTopoStatus(actionTopo.id, TopoStatus.Validated);
			const validatedTopo = lightTopos.find((lt) => lt.id === actionTopo.id)!;
			validatedTopo.validated = new Date().toISOString();
			validatedTopo.status = TopoStatus.Validated;
			setLightTopos(lightTopos.slice());
		}
		setPreviewTopo(undefined);
	}, [actionTopo, lightTopos]);
	const unvalidateTopo = useCallback(async () => {
		if (actionTopo) {
			await api.setTopoStatus(actionTopo.id, TopoStatus.Submitted);
			const unvalidatedTopo = lightTopos.find(
				(lt) => lt.id === actionTopo.id
			)!;
			unvalidatedTopo.validated = undefined;
			unvalidatedTopo.status = TopoStatus.Submitted;
			setLightTopos(lightTopos.slice());
		}
		setPreviewTopo(undefined);
	}, [actionTopo, lightTopos]);
	const deleteTopo = useCallback(() => {
		if (actionTopo) {
			api.deleteTopo(actionTopo);
			const newLightTopos = lightTopos.filter(
				(lt) => lt.id !== actionTopo.id
			)!;
			setLightTopos(newLightTopos);
		}
		setPreviewTopo(undefined);
	}, [actionTopo, lightTopos]);

	useContextMenu(() => setDropdownPosition(undefined), ref.current);
	const onContextMenu = (topo: LightTopo, position: { x: number; y: number }) => {
		setActionTopo(topo);
		setDropdownPosition(position);
	}

	return (
		<>
			<Header backLink="/user/profile" title="Administration" />

			<div className="flex h-full flex-row bg-white">
				<LeftbarDesktop currentMenuItem="ADMIN" />

				<div className="mt-[10%] md:mt-[5%] h-[10%] w-full">
					<div className="hide-scrollbar h-contentPlusHeader overflow-y-scroll pb-40 md:h-contentPlusShell">
						<div className="flex min-w-full flex-row flex-wrap px-4 py-6 md:px-8">
							{toposToDisplay.length === 0 &&
								<div className="relative flex h-[70vh] w-full justify-center">
									<div className="relative flex h-full w-[90%] items-center overflow-hidden rounded bg-grey-superlight">
											<div className="flex w-full flex-col items-center">
												<span>Aucun topo dans cette catégorie</span>
											</div>
									</div>
								</div>
							}
							{toposToDisplay.map((topo) => (
								<TopoCard
									key={topo.id}
									topo={topo}
									onContextMenu={onContextMenu}
									onClick={togglePreviewTopo}
								/>
							))}
						</div>

						<div className="absolute w-full md:w-[calc(100%-300px)] left-0 md:left-[calc(300px+1%)] bottom-[12vh] md:bottom-8 flex justify-center">
							<TabsFly 
								tabs={[
									{
										icon: Edit,
										iconStroke: true,
										label: "Brouillons",
										color: "second",
										action: () => setSelectedStatus(TopoStatus.Draft),
									},
									{
										icon: Recent,
										iconStroke: true,
										label: "En attente de validation",
										color: "third",
										action: () => setSelectedStatus(TopoStatus.Submitted),
									},
									{
										icon: Checked,
										iconFill: true,
										label: "Validés",
										color: "main",
										action: () => setSelectedStatus(TopoStatus.Validated),
									},
								]}
							/>
						</div>
					</div>
				</div>
			</div>

			{previewTopo && previewTopo.status === TopoStatus.Draft &&
				<TopoPreview
					topo={previewTopo}
					displayLastDate
					displayCreator
					mainButton={{ content: 'Ouvrir', link: `/topo/${encodeUUID(previewTopo.id)}?show=all` }}
					secondButton={{ content: 'Supprimer', onClick: showModalDelete, color: 'red' }}
					thirdButton={{ content: 'Modifier', link: '/builder/' + encodeUUID(previewTopo.id) }}
					fourthButton={{ content: 'Soumettre', onClick: showModalSubmit, color: 'third' }}
					onClose={() => setPreviewTopo(undefined)}
				/>
			}
			{previewTopo && previewTopo.status === TopoStatus.Submitted &&
				<TopoPreview
					topo={previewTopo}
					displayLastDate
					displayCreator
					mainButton={{ content: 'Ouvrir', link: `/topo/${encodeUUID(previewTopo.id)}?show=all` }}
					secondButton={{ content: 'Refuser', onClick: showModalReject, color: 'second' }}
					thirdButton={{ content: 'Modifier', link: '/builder/' + encodeUUID(previewTopo.id) }}
					fourthButton={{ content: 'Valider', onClick: showModalValidate, color: 'main' }}
					onClose={() => setPreviewTopo(undefined)}
				/>
			}
			{previewTopo && previewTopo.status === TopoStatus.Validated &&
				<TopoPreview
					topo={previewTopo}
					displayLastDate
					displayCreator
					mainButton={{ content: 'Ouvrir', link: '/topo/' + encodeUUID(previewTopo.id) }}
					secondButton={{ content: 'Dévalider', onClick: showModalUnvalidate, color: 'third' }}
					thirdButton={{ content: 'Modifier', link: '/builder/' + encodeUUID(previewTopo.id) }}
					fourthButton={{ content: 'Supprimer', onClick: showModalDelete, color: 'red' }}
					onClose={() => setPreviewTopo(undefined)}
				/>
			}

			{actionTopo && dropdownPosition && (
				<AdminActionDropdown
					topo={actionTopo}
					position={dropdownPosition}
					onValidateClick={showModalValidate}
					onUnvalidateClick={showModalUnvalidate}
					onRejectClick={showModalReject}
					onDeleteClick={showModalDelete}
					onSelect={() => setDropdownPosition(undefined)}
				/>
			)}
			<ModalSubmit
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={submitTopo}
			>
				Le topo sera envoyé en validation.
				Etes-vous sûr de vouloir continuer ?
			</ModalSubmit>
			<ModalValidate
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={validateTopo}
			>
				Une fois validé, le topo sera accessible par tous les utilisateurs.
				Etes-vous sûr de vouloir continuer ?
			</ModalValidate>
			<ModalUnvalidate
				buttonText="Confirmer"
				imgUrl={staticUrl.defaultProfilePicture}
				onConfirm={unvalidateTopo}
			>
				Le topo retournera en attente de validation. Etes-vous sûr de vouloir
				continuer ?
			</ModalUnvalidate>
			<ModalReject
				buttonText="Confirmer"
				imgUrl={staticUrl.defaultProfilePicture}
				onConfirm={rejectTopo}
			>
				Le topo retournera en brouillon. Etes-vous sûr de vouloir continuer ?
			</ModalReject>
			<ModalDelete
				buttonText="Confirmer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={deleteTopo}
			>
				Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer ?
			</ModalDelete>
		</>
	);
};
