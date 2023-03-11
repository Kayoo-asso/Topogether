import React, { useCallback } from "react";
import { QuarkArray, watchDependencies } from "helpers/quarky";
import { Description, Name, Waypoint } from "types";
import { SelectedWaypoint, useSelectStore } from "components/store/selectStore";
import { ImageInput } from "components/molecules/form/ImageInput";
import { TextInput } from "components/molecules/form/TextInput";
import { TextArea } from "components/molecules/form/TextArea";
import { Button } from "components/atoms/buttons/Button";
import { useDeleteStore } from "components/store/deleteStore";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";

interface WaypointFormProps {
	waypoints: QuarkArray<Waypoint>;
	className?: string;
}

export const WaypointForm: React.FC<WaypointFormProps> = watchDependencies(
	(props: WaypointFormProps) => {
		const selectedWaypoint = useSelectStore(s => s.item as SelectedWaypoint);
		const waypoint = selectedWaypoint.value();
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
				<ItemsHeaderButtons item={waypoint} onClose={flush.item} />

				<div className={`flex w-full ktext-subtitle mb-1 ${bp === 'mobile' ? '' : 'mt-20'}`}>Point de repère</div>
				<div className="flex flex-row items-end gap-6">
					<div className="w-28">
						<ImageInput
							value={waypoint.image}
							onChange={useCallback((images) => {
								selectedWaypoint.value.set({
									...waypoint,
									image: images[0],
								});
							}, [selectedWaypoint.value, waypoint])}
							onDelete={useCallback(() => {
								selectedWaypoint.value.set({
									...waypoint,
									image: undefined,
								});
							}, [selectedWaypoint.value, waypoint])}
						/>
					</div>
					<div className="flex h-full">
						<TextInput
							id="waypoint-name"
							label="Nom"
							value={waypoint.name}
							onChange={useCallback((e) =>
								selectedWaypoint.value.set({
									...waypoint,
									name: e.target.value as Name,
								})
							, [selectedWaypoint.value, waypoint])}
						/>
					</div>
				</div>

				<div className="flex flex-row gap-3">
					<TextInput
						id="waypoint-latitude"
						label="Latitude"
						type="number"
						value={waypoint.location[1]}
						onChange={useCallback((e) =>
							selectedWaypoint.value.set({
								...waypoint,
								location: [waypoint.location[0], parseFloat(e.target.value)],
							})
						, [selectedWaypoint.value, waypoint, waypoint.location])}
					/>
					<TextInput
						id="waypoint-longitude"
						label="Longitude"
						type="number"
						value={waypoint.location[0]}
						onChange={useCallback((e) =>
							selectedWaypoint.value.set({
								...waypoint,
								location: [parseFloat(e.target.value), waypoint.location[1]],
							})
						, [selectedWaypoint.value, waypoint, waypoint.location])}
					/>
				</div>

				<TextArea
					id="waypoint-description"
					label="Description"
					value={waypoint.description}
					onChange={useCallback((e) =>
						selectedWaypoint.value.set({
							...waypoint,
							description: e.target.value as Description,
						})
					, [selectedWaypoint.value, waypoint])}
				/>

				<div className="flex w-full grow items-end">
					<Button
						content="Supprimer"
						onClick={() => del.item(selectedWaypoint)}
						fullWidth
					/>
				</div>
			</div>
		);
	}
);

WaypointForm.displayName = "WaypointForm";
