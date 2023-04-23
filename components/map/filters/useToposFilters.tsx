import { Checkbox } from "components/atoms/Checkbox";
import { GradeSliderInput } from "components/molecules/form/GradeSliderInput";
import { SelectListMultiple } from "components/molecules/form/SelectListMultiple";
import { SliderInput } from "components/molecules/form/SliderInput";
import { hasFlag, toggleFlag } from "helpers/bitflags";
import { useCallback, useMemo, useState } from "react";
import { Amenities, LightGrade, LightTopoOld, TopoTypes } from "types";
import { TopoTypesName } from "types/BitflagNames";

export interface TopoFilterOptions {
	types: TopoTypes;
	boulderRange: [number, number];
	gradeRange: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">];
	adaptedToChildren: boolean;
}

export type TopoFiltersComponents = {
	TopoTypesFilter: () => JSX.Element;
	NbOfBouldersFilter: () => JSX.Element;
	DifficultyFilter: () => JSX.Element;
	ChildrenFilter: () => JSX.Element;
};

export function useToposFilters(
	lightTopos: LightTopoOld[]
): [TopoFiltersComponents, (topo: LightTopoOld) => boolean, () => void] {
	const filtersDomain: TopoFilterOptions = useMemo(() => {
		let maxBoulders = 0;
		for (const topo of lightTopos) {
			maxBoulders = Math.max(maxBoulders, topo.nbBoulders);
		}
		return {
			types: 0,
			boulderRange: [0, maxBoulders],
			gradeRange: [3, 9],
			adaptedToChildren: false,
		};
	}, [lightTopos]);
	const [filters, setFilters] = useState(filtersDomain);
	const updateTopoFilters = useCallback(
		<K extends keyof TopoFilterOptions>(
			option: K,
			value: TopoFilterOptions[K]
		) => {
			setFilters((f) => ({
				...f,
				[option]: value,
			}));
		},
		[]
	);

	const filterTopos = useCallback(
		(topo: LightTopoOld) => {
			//TODO : check if this works
			if (
				filters.types !== TopoTypes.None &&
				!hasFlag(filters.types, topo.type)
			) {
				return false;
			}
			if (
				topo.nbBoulders < filters.boulderRange[0] ||
				topo.nbBoulders > filters.boulderRange[1]
			) {
				return false;
			}
			if (filters.gradeRange[0] !== 3 || filters.gradeRange[1] !== 9) {
				const foundBouldersAtGrade = Object.entries(topo.grades || {}).some(
					([grade, count]) =>
						Number(grade) >= filters.gradeRange[0] &&
						Number(grade) <= filters.gradeRange[1] &&
						count !== 0
				);

				if (!foundBouldersAtGrade) {
					return false;
				}
			}
			return filters.adaptedToChildren
				? hasFlag(topo.amenities, Amenities.AdaptedToChildren)
				: true;
		},
		[filters]
	);

	const resetFilters = () => setFilters(filtersDomain);

	const TopoTypesFilter = useCallback(
		() => (
			<SelectListMultiple
				bitflagNames={TopoTypesName}
				value={filters.types}
				justify={false}
				onChange={(value) =>
					updateTopoFilters(
						"types",
						toggleFlag(filters.types, value as TopoTypes)
					)
				}
			/>
		),
		[filters.types]
	);
	const NbOfBouldersFilter = useCallback(
		() => (
			<div>
				<div className="ktext-label text-grey-medium">Nombre de blocs</div>
				<SliderInput
					domain={filtersDomain.boulderRange}
					values={filters.boulderRange}
					onChange={(value) => updateTopoFilters("boulderRange", value)}
				/>
			</div>
		),
		[filtersDomain.boulderRange, filters.boulderRange]
	);
	const DifficultyFilter = useCallback(
		() => (
			<div>
				<div className="ktext-label text-grey-medium">Difficultés</div>
				<GradeSliderInput
					values={filtersDomain.gradeRange}
					onChange={(range) => updateTopoFilters("gradeRange", range)}
				/>
			</div>
		),
		[filtersDomain.gradeRange]
	);
	const ChildrenFilter = useCallback(
		() => (
			<Checkbox
				label="Adapté aux enfants"
				checked={filters.adaptedToChildren}
				onClick={(isChecked) =>
					updateTopoFilters("adaptedToChildren", isChecked)
				}
			/>
		),
		[filters.adaptedToChildren]
	);

	return [
		{
			TopoTypesFilter,
			NbOfBouldersFilter,
			DifficultyFilter,
			ChildrenFilter,
		},
		filterTopos,
		resetFilters,
	];
}
