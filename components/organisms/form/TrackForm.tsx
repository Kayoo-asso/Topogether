import React, { useEffect, useRef } from "react";
import { Button, Checkbox, Select, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, ClimbTechniques, Description, Name, Track } from "types";
import { ReceptionName, selectOptions } from "types/EnumNames";
import { BitflagMultipleSelect } from "components/molecules/form/BitflagMultipleSelect";
import { ClimbTechniquesName, toggleFlag } from "helpers/bitflags";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { deleteTrack } from "helpers/builder";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";

interface TrackFormProps {
	className?: string,
}

export const TrackForm: React.FC<TrackFormProps> = watchDependencies(
	(props: TrackFormProps) => {
		const breakpoint = useBreakpoint();
		const nameInputRef = useRef<HTMLInputElement>(null);
		const [ModalDelete, showModalDelete] = useModal();

		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		if (!selectedBoulder.selectedTrack) throw new Error("Trying to open TrackForm without any track");
		const flushTrack = useSelectStore(s => s.flush.track);
		const trackQuark = selectedBoulder.selectedTrack;
		const track = trackQuark();

		useEffect(() => {
			if (breakpoint === "desktop" && nameInputRef.current) {
				nameInputRef.current.focus();
			}
		}, []);

		return (
			<>
				<div
					className={
						"flex h-full flex-col gap-6 " +
						(props.className ? props.className : "")
					}
					onClick={(e) => e.stopPropagation()}
				>
					<TextInput
						ref={nameInputRef}
						id="track-name"
						label="Nom de la voie"
						value={track.name}
						onChange={(e) =>
							trackQuark.set({
								...track,
								name: e.target.value as Name,
							})
						}
					/>

					<div className="flex flex-col gap-3">
						<Checkbox
							label="Traversée"
							checked={track.isTraverse}
							onClick={(checked) =>
								trackQuark.set({
									...track,
									isTraverse: checked,
								})
							}
						/>
						<Checkbox
							label="Départ assis"
							checked={track.isSittingStart}
							onClick={(checked) =>
								trackQuark.set({
									...track,
									isSittingStart: checked,
								})
							}
						/>
						<Checkbox
							label="Incontournable"
							checked={track.mustSee}
							onClick={(checked) =>
								trackQuark.set({
									...track,
									mustSee: checked,
								})
							}
						/>
					</div>

					<BitflagMultipleSelect<ClimbTechniques>
						id="track-techniques"
						label="Techniques"
						bitflagNames={ClimbTechniquesName}
						value={track.techniques}
						onChange={(value) => {
							trackQuark.set((t) => ({
								...t,
								techniques: toggleFlag(track.techniques, value),
							}));
						}}
					/>

					<Select
						id="track-receptions"
						label="Réception"
						//TODO FINISH
						options={selectOptions(ReceptionName)}
						value={track.reception}
						onChange={(value) =>
							trackQuark.set({
								...track,
								reception: value,
							})
						}
					/>

					<TextInput
						id="track-height"
						label="Hauteur"
						type="number"
						step="any"
						value={track.height}
						onChange={(e) =>
							trackQuark.set({
								...track,
								height: parseFloat(e.target.value),
							})
						}
					/>

					<TextArea
						id="track-description"
						label="Description"
						value={track.description}
						onChange={(e) =>
							trackQuark.set({
								...track,
								description: e.target.value as Description,
							})
						}
					/>

					<div className="flex w-full grow items-end">
						<Button
							content="Supprimer"
							onClick={showModalDelete}
							fullWidth
						/>
					</div>
				</div>

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={() => deleteTrack(selectedBoulder.value(), trackQuark, flushTrack, selectedBoulder)}
				>
					Etes-vous sûr de vouloir supprimer la voie ?
				</ModalDelete>
			</>
		);
	}
);

TrackForm.displayName = "TrackForm";
