import React, { useCallback, useEffect, useRef } from "react";
import { Checkbox, ImageInput, Show, TextArea, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Amenities, Description, Name, RockTypes, Topo } from "types";
import { BitflagMultipleSelect } from "components/molecules/form/BitflagMultipleSelect";
import { toggleFlag, rockNames, hasFlag } from "helpers/bitflags";
import { useBreakpoint } from "helpers/hooks";

interface InfoFormProps {
	topo: Quark<Topo>;
	className?: string;
}

export const InfoForm: React.FC<InfoFormProps> = watchDependencies(
	(props: InfoFormProps) => {
		const topo = props.topo();

		const handleAmenities = useCallback(
			(amenity) => () => {
				props.topo.set((t) => ({
					...t,
					amenities: toggleFlag(t.amenities, amenity),
				}));
			},
			[props.topo]
		);

		return (
			<div
				className={`flex flex-col h-[95%] gap-6 pb-[25px] md:pb-[60px] overflow-scroll ${
					props.className ? props.className : ""
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-row items-end gap-6">
					<div className="w-32 md:mt-4">
						<ImageInput
							value={topo.image}
							onChange={useCallback(
								(images) => {
									props.topo.set(t => ({
										...t,
										image: images[0],
									}));
								},
								[props.topo]
							)}
							onDelete={useCallback(() => {
								props.topo.set(t => ({
									...t,
									image: undefined,
								}));
							}, [props.topo])}
						/>
					</div>
					<TextInput
						id="topo-name"
						label="Nom du spot"
						value={topo.name}
						onChange={useCallback((e) =>
							props.topo.set(t => ({
								...t,
								name: e.target.value as Name,
							}))
						, [props.topo])}
					/>
				</div>

				<TextArea
					id="topo-description"
					label="Description"
					value={topo.description}
					onChange={useCallback((e) => {
						props.topo.set(t => ({
							...t,
							description: e.target.value as Description,
						}));
					}, [props.topo])}
				/>

				<BitflagMultipleSelect<RockTypes>
					id="topo-rock-type"
					label="Type de roche"
					bitflagNames={rockNames}
					value={topo.rockTypes}
					onChange={useCallback((value) => {
						props.topo.set(t => ({
							...t,
							rockTypes: toggleFlag(t.rockTypes, value),
						}));
					}, [props.topo])}
				/>

				<TextInput
					id="topo-altitude"
					label="Altitude (m)"
					type="number"
					value={topo.altitude}
					onChange={useCallback((e) =>
						props.topo.set(t => ({
							...t,
							altitude: parseInt(e.target.value),
						}))
					, [props.topo])}
				/>

				<Checkbox
					label="Spot adapté aux enfants"
					checked={hasFlag(topo.amenities, Amenities.AdaptedToChildren)}
					onClick={useCallback(handleAmenities(Amenities.AdaptedToChildren), [
						handleAmenities,
					])}
				/>

				<div className="flex flex-row gap-3">
					<Checkbox
						label="Toilettes"
						checked={hasFlag(topo.amenities, Amenities.Toilets)}
						onClick={useCallback(handleAmenities(Amenities.Toilets), [
							handleAmenities,
						])}
					/>
					<Checkbox
						label="Poubelles"
						checked={hasFlag(topo.amenities, Amenities.Bins)}
						onClick={useCallback(handleAmenities(Amenities.Bins), [
							handleAmenities,
						])}
					/>
				</div>

				<div className="flex flex-row gap-3">
					<Checkbox
						label="Point d'eau"
						checked={hasFlag(topo.amenities, Amenities.Waterspot)}
						onClick={useCallback(handleAmenities(Amenities.Waterspot), [
							handleAmenities,
						])}
					/>
					<Checkbox
						label="Espace picnic"
						checked={hasFlag(topo.amenities, Amenities.PicnicArea)}
						onClick={useCallback(handleAmenities(Amenities.PicnicArea), [
							handleAmenities,
						])}
					/>
				</div>

				<Checkbox
					label="Abris en cas de pluie"
					checked={hasFlag(topo.amenities, Amenities.Shelter)}
					onClick={useCallback(handleAmenities(Amenities.Shelter), [
						handleAmenities,
					])}
				/>

				<Checkbox
					label="Autres"
					checked={!!topo.otherAmenities}
					onClick={useCallback(() =>
						props.topo.set(t => ({
							...t,
							otherAmenities: (topo.otherAmenities === " "
								? ""
								: topo.otherAmenities && topo.otherAmenities.length > 0
								? topo.otherAmenities
								: " ") as Description,
						}))
					, [props.topo])}
				/>
				<Show when={() => topo.otherAmenities}>
					<TextArea
						id="topo-other-amenities"
						label="Autres équipements"
						value={topo.otherAmenities}
						onChange={useCallback((e) =>
							props.topo.set(t => ({
								...(topo),
								otherAmenities: e.target.value as Description,
							}))
						, [props.topo])}
					/>
				</Show>
			</div>
		);
	}
);

InfoForm.displayName = "InfoForm";
