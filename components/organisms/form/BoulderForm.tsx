import React, { useCallback } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { GeoCoordinates, Name, Topo } from "types";
import { boulderChanged } from "helpers/builder";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { TextInput } from "components/molecules/form/TextInput";
import { Checkbox } from "components/atoms/Checkbox";

interface BoulderFormProps {
	topo: Quark<Topo>;
	className?: string;
}

export const BoulderForm: React.FC<BoulderFormProps> = watchDependencies(
	(props: BoulderFormProps) => {
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value();

		return (
			<div
				className={
					"flex flex-col gap-6 " + (props.className ? props.className : "")
				}
				onClick={(e) => e.stopPropagation()}
			>
				<TextInput
					id="boulder-name"
					label="Nom du bloc"
					value={boulder.name}
					onChange={useCallback((e) => {
						selectedBoulder.value.set({
							...boulder,
							name: e.target.value as Name,
						});
					}, [selectedBoulder, boulder])}
				/>

				<div className="flex flex-row gap-3">
					<TextInput
						id="boulder-latitude"
						label="Latitude"
						type="number"
						value={boulder.location[1]}
						onChange={useCallback((e) => {
							const loc: GeoCoordinates = [
								boulder.location[0],
								parseFloat(e.target.value),
							];
							selectedBoulder.value.set({
								...boulder,
								location: loc,
							});
							boulderChanged(props.topo, boulder.id, loc);
						}, [selectedBoulder, boulder, boulderChanged, props.topo])}
					/>
					<TextInput
						id="boulder-longitude"
						label="Longitude"
						type="number"
						value={boulder.location[0]}
						onChange={useCallback((e) => {
							const loc: GeoCoordinates = [
								parseFloat(e.target.value),
								boulder.location[1],
							];
							selectedBoulder.value.set({
								...boulder,
								location: loc,
							});
							boulderChanged(props.topo, boulder.id, loc);
						}, [selectedBoulder, boulder, boulderChanged, props.topo])}
					/>
				</div>

				<div className="flex flex-col gap-3">
					<Checkbox
						label="High Ball"
						checked={boulder.isHighball}
						onClick={useCallback((checked) =>
							selectedBoulder.value.set({
								...boulder,
								isHighball: checked,
							})
						, [selectedBoulder, boulder])}
					/>
					<Checkbox
						label="Incontournable"
						checked={boulder.mustSee}
						onClick={useCallback((checked) =>
							selectedBoulder.value.set({
								...boulder,
								mustSee: checked,
							})
						, [selectedBoulder, boulder])}
					/>
					<Checkbox
						label="Descente dangereuse"
						checked={boulder.dangerousDescent}
						onClick={useCallback((checked) =>
							selectedBoulder.value.set({
								...boulder,
								dangerousDescent: checked,
							})
						, [selectedBoulder, boulder])}
					/>
				</div>
			</div>
		);
	}
);

BoulderForm.displayName = "BoulderForm";
