import React, { useEffect, useRef } from "react";
import { Button, ImageInput, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Description, Name, Waypoint } from "types";
import { useBreakpoint } from "helpers/hooks";

interface WaypointFormProps {
	waypoint: Quark<Waypoint>;
	className?: string;
	onDeleteWaypoint: () => void;
}

export const WaypointForm: React.FC<WaypointFormProps> = watchDependencies(
	(props: WaypointFormProps) => {
		const breakpoint = useBreakpoint();
		const nameInputRef = useRef<HTMLInputElement>(null);
		const waypoint = props.waypoint();

		useEffect(() => {
			if (breakpoint === "desktop" && nameInputRef.current) {
				nameInputRef.current.focus();
			}
		}, []);

		return (
			<div
				className={"flex flex-col gap-6 h-full " + (props.className ? props.className : "")}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-row gap-6 items-end">
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
					<div className="flex flex-col gap-2 justify-between h-full">
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

				<div className="w-full flex grow items-end">
					<Button content="Supprimer" onClick={() => props.onDeleteWaypoint()} fullWidth />
				</div>
			</div>
		);
	}
);

WaypointForm.displayName = "WaypointForm";
