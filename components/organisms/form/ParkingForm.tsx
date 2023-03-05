import React, { useCallback } from "react";
import { QuarkArray, watchDependencies } from "helpers/quarky";
import { Description, Name, Parking } from "types";
import { SelectedParking, useSelectStore } from "components/store/selectStore";
import { ImageInput } from "components/molecules/form/ImageInput";
import { TextInput } from "components/molecules/form/TextInput";
import { TextArea } from "components/molecules/form/TextArea";
import { Button } from "components/atoms/buttons/Button";
import { useDeleteStore } from "components/store/deleteStore";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";

interface ParkingFormProps {
	parkings: QuarkArray<Parking>
	className?: string;
}

export const ParkingForm: React.FC<ParkingFormProps> = watchDependencies(
	(props: ParkingFormProps) => {
		const selectedParking = useSelectStore(s => s.item as SelectedParking);
		const parking = selectedParking.value();
		const flush = useSelectStore(s => s.flush);
		const del = useDeleteStore(d => d.delete);

		const bp = useBreakpoint();
		
		return (
			<div
				className={
					"flex h-full w-full flex-col gap-6 px-5 pb-4 " +
					(props.className ? props.className : "")
				}
				onClick={(e) => e.stopPropagation()}
			>
				<ItemsHeaderButtons item={parking} onClose={flush.item} />

				<div className={`flex w-full ktext-subtitle mb-1 ${bp === 'mobile' ? '' : 'mt-20'}`}>Parking</div>
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
					<div className="flex h-full">
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
						onClick={() => del.item(selectedParking)}
						fullWidth
					/>
				</div>
			</div>
		);
	}
);

ParkingForm.displayName = "ParkingForm";
