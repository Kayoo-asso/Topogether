import React, { useEffect, useRef } from "react";
import { Button, Checkbox, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, GeoCoordinates, Name, Topo } from "types";
import { boulderChanged } from "helpers/builder";
import { useBreakpoint } from "helpers/hooks";

interface BoulderFormProps {
	boulder: Quark<Boulder>;
	topo: Quark<Topo>;
	className?: string;
}

export const BoulderForm: React.FC<BoulderFormProps> = watchDependencies(
	(props: BoulderFormProps) => {
		const breakpoint = useBreakpoint();
		const nameInputRef = useRef<HTMLInputElement>(null);
		const boulder = props.boulder();

		useEffect(() => {
			if (breakpoint === "desktop" && nameInputRef.current) {
				nameInputRef.current.focus();
			}
		}, []);

		return (
			<div
				className={
					"flex flex-col gap-6 " + (props.className ? props.className : "")
				}
				onClick={(e) => e.stopPropagation()}
			>
				<TextInput
					ref={nameInputRef}
					id="boulder-name"
					label="Nom du bloc"
					value={boulder.name}
					onChange={(e) => {
						props.boulder.set({
							...boulder,
							name: e.target.value as Name,
						});
					}}
				/>

				<div className="flex flex-row gap-3">
					<TextInput
						id="boulder-latitude"
						label="Latitude"
						type="number"
						value={boulder.location[1]}
						onChange={(e) => {
							const loc: GeoCoordinates = [
								boulder.location[0],
								parseFloat(e.target.value),
							];
							props.boulder.set({
								...boulder,
								location: loc,
							});
							boulderChanged(props.topo, boulder.id, loc);
						}}
					/>
					<TextInput
						id="boulder-longitude"
						label="Longitude"
						type="number"
						value={boulder.location[0]}
						onChange={(e) => {
							const loc: GeoCoordinates = [
								parseFloat(e.target.value),
								boulder.location[1],
							];
							props.boulder.set({
								...boulder,
								location: loc,
							});
							boulderChanged(props.topo, boulder.id, loc);
						}}
					/>
				</div>

				<div className="flex flex-col gap-3">
					<Checkbox
						label="High Ball"
						checked={boulder.isHighball}
						onClick={(checked) =>
							props.boulder.set({
								...boulder,
								isHighball: checked,
							})
						}
					/>
					<Checkbox
						label="Incontournable"
						checked={boulder.mustSee}
						onClick={(checked) =>
							props.boulder.set({
								...boulder,
								mustSee: checked,
							})
						}
					/>
					<Checkbox
						label="Descente dangereuse"
						checked={boulder.dangerousDescent}
						onClick={(checked) =>
							props.boulder.set({
								...boulder,
								dangerousDescent: checked,
							})
						}
					/>
				</div>
			</div>
		);
	}
);

BoulderForm.displayName = "BoulderForm";
