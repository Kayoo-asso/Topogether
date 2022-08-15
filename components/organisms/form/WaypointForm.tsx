import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button, ImageInput, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Name, Topo, Waypoint } from "types";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { ItemType } from "../builder/Slideover.right.builder";

interface WaypointFormProps {
	topo: Quark<Topo>;
	waypoint: Quark<Waypoint>;
	setSelectedItem: Dispatch<SetStateAction<ItemType>>;
	className?: string;
	onDeleteWaypoint: () => void;
}

export const WaypointForm: React.FC<WaypointFormProps> = watchDependencies(
	(props: WaypointFormProps) => {
		const breakpoint = useBreakpoint();
		const nameInputRef = useRef<HTMLInputElement>(null);
		const waypoint = props.waypoint();

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
								value={waypoint.image}
								onChange={(images) => {
									props.waypoint.set({
										...waypoint,
										image: images[0],
									});
								}}
								onDelete={() => {
									props.waypoint.set({
										...waypoint,
										image: undefined,
									});
								}}
							/>
						</div>
						<div className="flex h-full flex-col justify-between gap-2">
							<div className="ktext-subtitle md:mb-3">Point de repère</div>
							<TextInput
								ref={nameInputRef}
								id="waypoint-name"
								label="Nom"
								value={waypoint.name}
								onChange={(e) =>
									props.waypoint.set({
										...waypoint,
										name: e.target.value as Name,
									})
								}
							/>
						</div>
					</div>

					<div className="flex flex-row gap-3">
						<TextInput
							id="waypoint-latitude"
							label="Latitude"
							type="number"
							value={waypoint.location[1]}
							onChange={(e) =>
								props.waypoint.set({
									...waypoint,
									location: [waypoint.location[0], parseFloat(e.target.value)],
								})
							}
						/>
						<TextInput
							id="waypoint-longitude"
							label="Longitude"
							type="number"
							value={waypoint.location[0]}
							onChange={(e) =>
								props.waypoint.set({
									...waypoint,
									location: [parseFloat(e.target.value), waypoint.location[1]],
								})
							}
						/>
					</div>

					<TextArea
						id="waypoint-description"
						label="Description"
						value={waypoint.description}
						onChange={(e) =>
							props.waypoint.set({
								...waypoint,
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
					onConfirm={() => {
						props.topo().waypoints.removeQuark(props.waypoint);
						props.setSelectedItem({ type:'none' });
						props.onDeleteWaypoint();
					}}
				>
					Etes-vous sûr de vouloir supprimer le point de repère ?
				</ModalDelete>
			</>
		);
	}
);

WaypointForm.displayName = "WaypointForm";
