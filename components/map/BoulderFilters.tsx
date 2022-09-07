import React, { useState, useCallback } from "react";
import { Checkbox, RoundButton } from "components";
import { Boulder, gradeToLightGrade, LightGrade, TrackDanger, TrackSpec } from "types";
import {
	GradeSliderInput,
	SliderInput,
} from "../molecules";
import {
	hasSomeFlags,
	toggleFlag,
} from "helpers/bitflags";
import FilterIcon from "assets/icons/filter.svg";
import { Quark } from "helpers/quarky";
import { SpecSelector } from "components/molecules/form/SpecSelector";

export interface BoulderFilterOptions {
	spec: TrackSpec;
	tracksRange: [number, number];
	gradeRange: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">];
	mustSee: boolean;
}

interface BoulderFiltersProps {
	initialOpen?: boolean;
	domain: BoulderFilterOptions;
	values: BoulderFilterOptions;
	onChange: (options: BoulderFilterOptions) => void;
}

export function filterBoulders(
	boulders: Iterable<Quark<Boulder>>,
	options: BoulderFilterOptions
): Quark<Boulder>[] {
	const result: Quark<Boulder>[] = [];
	for (const boulderQ of boulders) {
		const boulder = boulderQ();
		// First apply the general filters
		if (
			boulder.tracks.length < options.tracksRange[0] ||
			boulder.tracks.length > options.tracksRange[1]
		) {
			continue;
		}
		if (options.mustSee && !boulder.mustSee) continue;

		// Then check out the tracks
		const minGrade = options.gradeRange[0];
		const maxGrade = options.gradeRange[1];
		// Skip the iteration in the common case where the options are the default ones
		// - options.spec === TrackDanger.None means the user does not want to filter based on spec
		// - `maxGrade - minGrade` is 6 only if the range goes from grade 3 to grade 9, which always matches all tracks
		let hasGrade = maxGrade - minGrade === 6;
		let hasSpec = options.spec === TrackDanger.None;
		if (!hasGrade || !hasSpec) {
			for (const track of boulder.tracks) {
				hasSpec =
				hasSpec || hasSomeFlags(track.spec, options.spec);
				const lightGrade = gradeToLightGrade(track.grade);
				hasGrade =
					hasGrade || (lightGrade >= minGrade && lightGrade <= maxGrade);
			}
			if (!hasGrade || !hasSpec) continue;
		}
		result.push(boulderQ);
	}
	return result;
}

export const BoulderFilters: React.FC<BoulderFiltersProps> = ({
	initialOpen = false,
	...props
}: BoulderFiltersProps) => {
	const [open, setOpen] = useState(initialOpen);

	const updateBoulderFilters = useCallback(
		<K extends keyof BoulderFilterOptions>(
			option: K,
			value: BoulderFilterOptions[K]
		) => {
			props.onChange({
				...props.values,
				[option]: value,
			});
		},
		[props.values]
	);

	const updateSpec = useCallback((v) => {
		props.onChange({
			...props.values,
			spec: toggleFlag(props.values.spec, v),
		});
	}, [props.values]);

	const renderFilters = () => (
		<React.Fragment>
			<SpecSelector 
				value={props.values.spec}
				onChange={updateSpec}
			/>
			{props.domain.tracksRange[1] > 0 &&
				<div>
					<div className="ktext-label text-grey-medium">Nombre de voies</div>
					<SliderInput
						domain={props.domain.tracksRange}
						values={props.values.tracksRange}
						onChange={(value) => updateBoulderFilters("tracksRange", value)}
					/>
				</div>
			}
			<div>
				<div className="ktext-label text-grey-medium">Difficultés</div>
				<GradeSliderInput
					values={props.domain.gradeRange}
					onChange={(value) => updateBoulderFilters("gradeRange", value)}
				/>
			</div>
			<Checkbox
				label="Incontournable"
				checked={props.values.mustSee}
				onClick={(isChecked) => updateBoulderFilters("mustSee", isChecked)}
			/>
		</React.Fragment>
	);

	return (
		<>
			{!open && (
				<RoundButton onClick={() => setOpen(true)}>
					<FilterIcon className="h-6 w-6 fill-main stroke-main" />
				</RoundButton>
			)}
			{open && (
				<div className="relative z-40 flex min-w-[250px] max-w-[60%] flex-col rounded-lg bg-white shadow">
					<div
						className="flex max-w-[150px] cursor-pointer flex-row items-center rounded-lg bg-main p-3 pt-4 pl-5 shadow"
						onClick={() => setOpen(false)}
					>
						<FilterIcon className="h-6 w-6 fill-white stroke-white" />
						<div className="ktext-subtitle ml-3 text-white">Filtres</div>
					</div>

					<div className="flex min-h-[100px] flex-col gap-6 p-5 pb-8">
						{renderFilters()}
					</div>
				</div>
			)}
		</>
	);
};
