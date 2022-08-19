import React, { useCallback, useEffect, useRef } from "react";
import { Button, ImageInput, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Name, Topo } from "types";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { SelectedWaypoint, useSelectStore } from "components/pages/selectStore";

interface WaypointFormProps {
	topo: Quark<Topo>;
	className?: string;
}

export const WaypointForm: React.FC<WaypointFormProps> = watchDependencies(
	(props: WaypointFormProps) => {
		const breakpoint = useBreakpoint();
		const selectedWaypoint = useSelectStore(s => s.item as SelectedWaypoint);
		const waypoint = selectedWaypoint.value();
		const flush = useSelectStore(s => s.flush);
		
		const nameInputRef = useRef<HTMLInputElement>(null);

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
						"flex h-full w-full flex-col gap-6 px-5 pb-4 " +
						(props.className ? props.className : "")
					}
					onClick={(e) => e.stopPropagation()}
				>
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
						<div className="flex h-full flex-col justify-between gap-2">
							<div className="ktext-subtitle md:mb-3">Point de repère</div>
							<TextInput
								ref={nameInputRef}
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
							onClick={showModalDelete}
							fullWidth
						/>
					</div>
				</div>

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={useCallback(() => {
						props.topo().waypoints.removeQuark(selectedWaypoint.value);
						breakpoint === 'mobile' ? flush.all() : flush.item();
					}, [props.topo().waypoints, selectedWaypoint.value, breakpoint, flush.all, flush.item])}
				>
					Etes-vous sûr de vouloir supprimer le point de repère ?
				</ModalDelete>
			</>
		);
	}
);

WaypointForm.displayName = "WaypointForm";
