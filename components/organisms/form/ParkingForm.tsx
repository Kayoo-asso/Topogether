import React, { useCallback } from "react";
import { Button, ImageInput, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Name, Topo } from "types";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { SelectedParking, useSelectStore } from "components/pages/selectStore";

interface ParkingFormProps {
	topo: Quark<Topo>
	className?: string;
}

export const ParkingForm: React.FC<ParkingFormProps> = watchDependencies(
	(props: ParkingFormProps) => {
		const breakpoint = useBreakpoint();
		const selectedParking = useSelectStore(s => s.item as SelectedParking);
		const parking = selectedParking.value();
		const flush = useSelectStore(s => s.flush);
		
		const [ModalDelete, showModalDelete] = useModal();

		return (
			<>
				<div
					className={
						"flex h-full w-full flex-col gap-6 px-5 pb-4 " +
						(props.className ? props.className : "")
					}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-row items-end gap-6">
						<div className="w-28">
							<ImageInput
								value={parking.image}
								onChange={useCallback((files) => {
									selectedParking.value.set({
										...parking,
										image: files[0],
									});
								}, [selectedParking.value, parking])}
								onDelete={useCallback(() => {
									selectedParking.value.set({
										...parking,
										image: undefined,
									});
								}, [selectedParking.value, parking])}
							/>
						</div>
						<div className="flex h-full flex-col justify-between gap-2">
							<div className="ktext-subtitle md:mb-3">Parking</div>
							<TextInput
								id="parking-name"
								label="Nom"
								value={parking.name}
								onChange={useCallback((e) =>
									selectedParking.value.set({
										...parking,
										name: e.target.value as Name,
									})
								, [selectedParking.value, parking])}
							/>
						</div>
					</div>

					<div className="flex flex-row gap-3">
						<TextInput
							id="parking-latitude"
							label="Latitude"
							type="number"
							value={parking.location[1]}
							onChange={useCallback((e) =>
								selectedParking.value.set({
									...parking,
									location: [parking.location[0], parseFloat(e.target.value)],
								})
							, [selectedParking.value, parking, parking.location])}
						/>
						<TextInput
							id="parking-longitude"
							label="Longitude"
							type="number"
							value={parking.location[0]}
							onChange={useCallback((e) =>
								selectedParking.value.set({
									...parking,
									location: [parseFloat(e.target.value), parking.location[1]],
								})
							, [selectedParking.value, parking, parking.location])}
						/>
					</div>

					<TextInput
						id="parking-spaces"
						label="Nombre de places"
						type="number"
						value={parking.spaces}
						onChange={useCallback((e) =>
							selectedParking.value.set({
								...parking,
								spaces: parseInt(e.target.value),
							})
						, [selectedParking.value, parking])}
					/>

					<TextArea
						id="parking-description"
						label="Description"
						value={parking.description}
						onChange={useCallback((e) =>
							selectedParking.value.set({
								...parking,
								description: e.target.value as Description,
							})
						, [selectedParking.value, parking])}
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
					onConfirm={useCallback(() => {
						props.topo().parkings.removeQuark(selectedParking.value);
						breakpoint === 'mobile' ? flush.all() : flush.item();
					}, [props.topo().parkings, breakpoint, selectedParking.value, flush.all, flush.item])}
				>
					Etes-vous sûr de vouloir supprimer le parking ?
				</ModalDelete>
			</>
		);
	}
);

ParkingForm.displayName = "ParkingForm";
