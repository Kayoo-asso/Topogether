import FilterIcon from "assets/icons/filter.svg";
import React, { useEffect } from "react";
import { Amenities, LightGrade, TopoTypes } from "types";
import { TopoTypesName } from "types/BitflagNames";
import { GradeSlider } from "~/components/forms/GradeSlider";
import { Checkbox } from "~/components/ui/Checkbox";
import { SelectListMultiple } from "~/components/ui/SelectListMultiple";
import { SliderInput } from "~/components/ui/SliderInput";
import { hasFlag, toggleFlag } from "~/helpers/bitflags";
import { LightTopo } from "~/server/queries";
import { useWorldMapStore } from "~/stores/worldmapStore";
import { classNames, gradeCategory } from "~/utils";

export interface TopoFilters {
	types: TopoTypes;
	rockRange: [number, number];
	gradeRange: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">];
	adaptedToChildren: boolean;
}

interface TopoFiltersProps {
	topos: LightTopo[];
}

export function initialTopoFilters(lightTopos: LightTopo[]): TopoFilters {
	let maxBoulders = 0;
	for (const topo of lightTopos) {
		maxBoulders = Math.max(maxBoulders, topo.nbRocks);
	}
	return {
		types: 0,
		rockRange: [0, maxBoulders],
		gradeRange: [3, 9],
		adaptedToChildren: false,
	};
}

export function filterTopos(topos: LightTopo[], filters: TopoFilters) {
	const filtered: LightTopo[] = [];
	const [minRocks, maxRocks] = filters.rockRange;
	const [minGrade, maxGrade] = filters.gradeRange;
	for (const topo of topos) {
		const isRightType =
			filters.types === TopoTypes.None || hasFlag(filters.types, topo.type);
		const hasRightNumberOfRocks =
			topo.nbRocks >= minRocks && topo.nbRocks <= maxRocks;
		const passesChildrenFilter =
			!filters.adaptedToChildren || topo.adaptedToChildren;

		let hasRocksAtGrade = false;
		// No grade filtering in this case
		if (minGrade === 3 && maxGrade === 9) {
			hasRocksAtGrade = true;
		} else {
			console.log({topo})
			for (const grade of topo.allGrades) {
				const category = gradeCategory(grade);
				const catNb = Number(category);
				hasRocksAtGrade =
					hasRocksAtGrade || (catNb >= minGrade && catNb <= maxGrade);
			}
		}

		if (
			isRightType &&
			hasRightNumberOfRocks &&
			hasRocksAtGrade &&
			passesChildrenFilter
		) {
			filtered.push(topo);
		}
	}
	return filtered;
}

function TopoFilters({ topos: lightTopos }: TopoFiltersProps) {
	const filters = useWorldMapStore((s) => s.filters);
	const domain = useWorldMapStore((s) => s.filtersDomain);
	const setFilters = useWorldMapStore((s) => s.setFilters);

	useEffect(() => {
		const initial = initialTopoFilters(lightTopos);
		useWorldMapStore.setState({
			filtersDomain: initial,
			filters: initial,
		});
	}, [lightTopos]);

	return (
		<>
			{/* Topo types */}
			<SelectListMultiple
				bitflagNames={TopoTypesName}
				value={filters.types}
				justify={false}
				onChange={(value) =>
					setFilters({
						types: toggleFlag(filters.types, value),
					})
				}
			/>
			{/* Number of boulders */}
			<div>
				<div className="ktext-label text-grey-medium">Nombre de blocs</div>
				<SliderInput
					domain={domain.rockRange}
					values={filters.rockRange}
					onChange={(value) => setFilters({ rockRange: value })}
				/>
			</div>
			{/* Difficulties */}
			<div>
				<div className="ktext-label text-grey-medium">Difficultés</div>
				<GradeSlider
					values={domain.gradeRange}
					onChange={(range) => setFilters({ gradeRange: range })}
				/>
			</div>
			{/* Adapted to children */}
			<Checkbox
				label="Adapté aux enfants"
				checked={filters.adaptedToChildren}
				onClick={(isChecked) => setFilters({ adaptedToChildren: isChecked })}
			/>
		</>
	);
}

export function TopoFiltersDesktop(props: TopoFiltersProps) {
	const open = useWorldMapStore((s) => s.filtersOpen);
	const toggle = useWorldMapStore((s) => s.toggleFilters);
	const reset = useWorldMapStore((s) => s.resetFilters);

	return (
		<div
			className="relative z-40 flex min-w-[250px] max-w-[80%] flex-col rounded-lg bg-white shadow md:max-w-[40%]"
			
		>
			<div className="flex flex-row items-center justify-between">
				<div
					className="flex max-w-[150px] flex-row items-center rounded-lg bg-main p-3 pl-5 pt-4 shadow md:cursor-pointer"
					onClick={toggle}
				>
					<FilterIcon className="h-6 w-6 fill-white stroke-white" />
					<div className="ktext-subtitle ml-3 text-white">Filtres</div>
				</div>

				<button className="mr-8 text-second" onClick={reset}>
					Reset
				</button>
			</div>

			<div className="flex min-h-[100px] flex-col gap-6 p-5 pb-8">
				<TopoFilters {...props} />
			</div>
		</div>
	);
}

export function TopoFiltersMobile(props: TopoFiltersProps) {
	const reset = useWorldMapStore((s) => s.resetFilters);
	return (
		<div className="flex h-full flex-col gap-2 md:hidden">
			<div className="flex flex-row justify-end">
				<button className="mr-8 text-second" onClick={reset}>
					Reset
				</button>
			</div>

			<div className="flex min-h-[100px] flex-col gap-6 px-5 pb-8 pt-2">
				<TopoFilters {...props} />
			</div>
		</div>
	);
}
