import React, { useState, useCallback } from "react";
import { Checkbox, RoundButton } from "components";
import { Boulder, ClimbTechniques, gradeToLightGrade, LightGrade } from "types";
import {
	GradeSliderInput,
	BitflagMultipleSelect,
	SliderInput,
} from "../molecules";
import {
	ClimbTechniquesName,
	hasSomeFlags,
	toggleFlag,
} from "helpers/bitflags";
import FilterIcon from "assets/icons/filter.svg";
import { Quark } from "helpers/quarky";

export interface BoulderFilterOptions {
	techniques: ClimbTechniques;
	tracksRange: [number, number];
	gradeRange: [Exclude<LightGrade, "None">, Exclude<LightGrade, "None">];
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
		// - options.techniques === ClimbTechniques.None means the user does not want to filter based on techniques
		// - `maxGrade - minGrade` is 6 only if the range goes from grade 3 to grade 9, which always matches all tracks
		let hasGrade = maxGrade - minGrade === 6;
		let hasTechniques = options.techniques === ClimbTechniques.None;
		if (!hasGrade || !hasTechniques) {
			for (const track of boulder.tracks) {
				hasTechniques =
					hasTechniques || hasSomeFlags(track.techniques, options.techniques);
				const lightGrade = gradeToLightGrade(track.grade);
				hasGrade =
					hasGrade || (lightGrade >= minGrade && lightGrade <= maxGrade);
			}
			if (!hasGrade || !hasTechniques) continue;
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

	const updateClimbTechniquesFilters = useCallback(
		(value: ClimbTechniques) => {
			props.onChange({
				...props.values,
				techniques: toggleFlag(props.values.techniques, value),
			});
		},
		[props.values]
	);

	const renderFilters = () => (
		<React.Fragment>
			<BitflagMultipleSelect<ClimbTechniques>
				id="track-techniques"
				label="Techniques"
				bitflagNames={ClimbTechniquesName}
				value={props.values.techniques}
				onChange={updateClimbTechniquesFilters}
			/>
			<div>
				<div className="ktext-label text-grey-medium">Nombre de voies</div>
				<SliderInput
					domain={props.domain.tracksRange}
					values={props.values.tracksRange}
					onChange={(value) => updateBoulderFilters("tracksRange", value)}
				/>
			</div>
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
