import FilterIcon from "assets/icons/filter.svg";
import { Checkbox } from "components/atoms/Checkbox";
import { GradeSliderInput } from "components/molecules/form/GradeSliderInput";
import { SelectListMultiple } from "components/molecules/form/SelectListMultiple";
import { SliderInput } from "components/molecules/form/SliderInput";
import { useSelectStore } from "components/store/selectStore";
import { hasFlag, toggleFlag } from "helpers/bitflags";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import React from "react";
import { Amenities, LightGrade, TopoTypes } from "types";
import { TopoTypesName } from "types/BitflagNames";
import { LightTopo } from "~/server/queries";
import { SetState } from "~/types";
import { gradeCategory } from "~/utils";

export interface TopoFilters {
	types: TopoTypes;
	rockRange: [number, number];
	gradeRange: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">];
	adaptedToChildren: boolean;
}

interface TopoFiltersProps {
	filters: TopoFilters;
	domain: TopoFilters;
	setFilters: SetState<TopoFilters>;
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

export function filterTopos(filters: TopoFilters, topos: LightTopo[]) {
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

function TopoFilters({ filters, domain, setFilters }: TopoFiltersProps) {
	return (
		<>
			{/* Topo types */}
			<SelectListMultiple
				bitflagNames={TopoTypesName}
				value={filters.types}
				justify={false}
				onChange={(value) =>
					setFilters((f) => ({
						...f,
						types: toggleFlag(f.types, value),
					}))
				}
			/>
			{/* Number of boulders */}
			<div>
				<div className="ktext-label text-grey-medium">Nombre de blocs</div>
				<SliderInput
					domain={domain.rockRange}
					values={filters.rockRange}
					onChange={(value) => setFilters((f) => ({ ...f, rockRange: value }))}
				/>
			</div>
			{/* Difficulties */}
			<div>
				<div className="ktext-label text-grey-medium">Difficultés</div>
				<GradeSliderInput
					values={domain.gradeRange}
					onChange={(range) => setFilters((f) => ({ ...f, gradeRange: range }))}
				/>
			</div>
			{/* Adapted to children */}
			<Checkbox
				label="Adapté aux enfants"
				checked={filters.adaptedToChildren}
				onClick={(isChecked) =>
					setFilters((f) => ({ ...f, adaptedToChildren: isChecked }))
				}
			/>
		</>
	);
}

export function TopoFiltersDesktop(props: TopoFiltersProps) {
	const select = useSelectStore((s) => s.select);
	const bp = useBreakpoint();
	const open = useSelectStore((s) => s.info) === "FILTERS";

	return (
		<div
			className={`${
				open ? "" : "hidden"
			} relative z-40 flex min-w-[250px] max-w-[80%] flex-col rounded-lg bg-white shadow md:max-w-[40%]`}
		>
			<div className="flex flex-row items-center justify-between">
				<div
					className={`flex max-w-[150px] flex-row items-center rounded-lg bg-main p-3 pl-5 pt-4 shadow md:cursor-pointer`}
					onClick={() => select.info("NONE", bp)}
				>
					<FilterIcon className="h-6 w-6 fill-white stroke-white" />
					<div className="ktext-subtitle ml-3 text-white">Filtres</div>
				</div>

				<div
					className="mr-8 text-second md:cursor-pointer"
					onClick={() => props.setFilters(props.domain)}
				>
					Reset
				</div>
			</div>

			<div className="flex min-h-[100px] flex-col gap-6 p-5 pb-8">
				<TopoFilters {...props} />
			</div>
		</div>
	);
}

export function TopoFiltersMobile(props: TopoFiltersProps) {
	return (
		<div className="flex h-full flex-col gap-2 md:hidden">
			<div className="flex flex-row justify-end">
				<div
					className="mr-8 text-second"
					onClick={() => props.setFilters(props.domain)}
				>
					Reset
				</div>
			</div>

			<div className="flex min-h-[100px] flex-col gap-6 px-5 pb-8 pt-2">
				<TopoFilters {...props} />
			</div>
		</div>
	);
}
