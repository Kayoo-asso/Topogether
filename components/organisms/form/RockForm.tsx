import React, { useCallback } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { GeoCoordinates, Name, Topo, TopoTypes } from "types";
import { boulderChanged } from "helpers/builder";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { TextInput } from "components/molecules/form/TextInput";
import { Checkbox } from "components/atoms/Checkbox";

interface RockFormProps {
	topo: Quark<Topo>;
	className?: string;
}

export const RockForm: React.FC<RockFormProps> = watchDependencies(
	(props: RockFormProps) => {
		const topoType = props.topo().type;
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value();

		return (
			<div
				className={"flex flex-col gap-6 " + (props.className ? props.className : "")}
				onClick={(e) => e.stopPropagation()}
			>
				<TextInput
					id="rock-name"
					label='Nom du caillou'
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
						id="rock-latitude"
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
						id="rock-longitude"
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
						className={topoType === TopoTypes.Boulder ? ''  : 'hidden'}
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
						className={topoType === TopoTypes.Boulder ? ''  : 'hidden'}
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

RockForm.displayName = "RockForm";
