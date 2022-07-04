import React, { useEffect, useRef } from "react";
import { Button, Checkbox, Select, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { ClimbTechniques, Description, Name, Track } from "types";
import { ReceptionName, selectOptions } from "types/EnumNames";
import { BitflagMultipleSelect } from "components/molecules/form/BitflagMultipleSelect";
import { ClimbTechniquesName, toggleFlag } from "helpers/bitflags";
import { useBreakpoint } from "helpers/hooks";

interface TrackFormProps {
	track: Quark<Track>;
	className?: string;
	onDeleteTrack: () => void;
}

export const TrackForm: React.FC<TrackFormProps> = watchDependencies(
	(props: TrackFormProps) => {
		const breakpoint = useBreakpoint();
		const nameInputRef = useRef<HTMLInputElement>(null);
		const track = props.track();

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
							props.track.set({
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
								props.track.set({
									...track,
									isTraverse: checked,
								})
							}
						/>
						<Checkbox
							label="Départ assis"
							checked={track.isSittingStart}
							onClick={(checked) =>
								props.track.set({
									...track,
									isSittingStart: checked,
								})
							}
						/>
						<Checkbox
							label="Incontournable"
							checked={track.mustSee}
							onClick={(checked) =>
								props.track.set({
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
							props.track.set((t) => ({
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
							props.track.set({
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
							props.track.set({
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
							props.track.set({
								...track,
								description: e.target.value as Description,
							})
						}
					/>

					<div className="flex w-full grow items-end">
						<Button
							content="Supprimer"
							onClick={props.onDeleteTrack}
							fullWidth
						/>
					</div>
				</div>
			</>
		);
	}
);

TrackForm.displayName = "TrackForm";
