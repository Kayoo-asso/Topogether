import React, { useEffect, useRef } from "react";
import { Button, ImageInput, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Name, Parking, Topo } from "types";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";

interface ParkingFormProps {
	topo: Quark<Topo>
	parking: Quark<Parking>;
	className?: string;
	onDeleteParking: () => void;
}

export const ParkingForm: React.FC<ParkingFormProps> = watchDependencies(
	(props: ParkingFormProps) => {
		const breakpoint = useBreakpoint();
		const nameInputRef = useRef<HTMLInputElement>(null);
		const parking = props.parking();

		const [ModalDelete, showModalDelete] = useModal();

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
					<div className="flex flex-row items-end gap-6">
						<div className="w-28">
							<ImageInput
								value={parking.image}
								onChange={(files) => {
									props.parking.set({
										...parking,
										image: files[0],
									});
								}}
								onDelete={() => {
									props.parking.set({
										...parking,
										image: undefined,
									});
								}}
							/>
						</div>
						<div className="flex h-full flex-col justify-between gap-2">
							<div className="ktext-subtitle md:mb-3">Parking</div>
							<TextInput
								ref={nameInputRef}
								id="parking-name"
								label="Nom"
								value={parking.name}
								onChange={(e) =>
									props.parking.set({
										...parking,
										name: e.target.value as Name,
									})
								}
							/>
						</div>
					</div>

					<div className="flex flex-row gap-3">
						<TextInput
							id="parking-latitude"
							label="Latitude"
							type="number"
							value={parking.location[1]}
							onChange={(e) =>
								props.parking.set({
									...parking,
									location: [parking.location[0], parseFloat(e.target.value)],
								})
							}
						/>
						<TextInput
							id="parking-longitude"
							label="Longitude"
							type="number"
							value={parking.location[0]}
							onChange={(e) =>
								props.parking.set({
									...parking,
									location: [parseFloat(e.target.value), parking.location[1]],
								})
							}
						/>
					</div>

					<TextInput
						id="parking-spaces"
						label="Nombre de places"
						type="number"
						value={parking.spaces}
						onChange={(e) =>
							props.parking.set({
								...parking,
								spaces: parseInt(e.target.value),
							})
						}
					/>

					<TextArea
						id="parking-description"
						label="Description"
						value={parking.description}
						onChange={(e) =>
							props.parking.set({
								...parking,
								description: e.target.value as Description,
							})
						}
					/>

					<div className="flex w-full grow items-end">
						<Button
							content="Supprimer"
							onClick={() => props.onDeleteParking()}
							fullWidth
						/>
					</div>
				</div>

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={() => {
						props.topo().parkings.removeQuark(props.parking);
						props.onDeleteParking();
					}}
				>
					Etes-vous sûr de vouloir supprimer le point de repère ?
				</ModalDelete>
			</>
		);
	}
);

ParkingForm.displayName = "ParkingForm";
