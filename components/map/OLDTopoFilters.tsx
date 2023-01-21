import React, { useCallback, useState } from "react";
import { Checkbox, RoundButton } from "components";
import { LightGrade, TopoTypes } from "types";
import { GradeSliderInput, SliderInput } from "..";
import FilterIcon from "assets/icons/filter.svg";
import { SelectListMultiple } from "components/molecules/form/SelectListMultiple";
import { TopoTypesName } from "types/BitflagNames";
import { toggleFlag } from "helpers/bitflags";

export interface TopoFilterOptions {
	types: TopoTypes;
	boulderRange: [number, number];
	gradeRange: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">];
	adaptedToChildren: boolean;
}

interface TopoFiltersProps {
	initialOpen?: boolean;
	domain: TopoFilterOptions;
	values: TopoFilterOptions;
	onChange: (options: TopoFilterOptions) => void;
}
export const TopoFilters: React.FC<TopoFiltersProps> = ({
	initialOpen = false,
	...props
}: TopoFiltersProps) => {
	const [open, setOpen] = useState(initialOpen);

	const updateTopoFilters = useCallback(
		<K extends keyof TopoFilterOptions>(
			option: K,
			value: TopoFilterOptions[K]
		) => {
			props.onChange({
				...props.values,
				[option]: value,
			});
		},
		[props.values]
	);

	const renderFilters = () => (
		<React.Fragment>
			<SelectListMultiple 
				bitflagNames={TopoTypesName}
				value={props.values.types}
				label="Types de spot"
				justify={false}
				onChange={(value) => updateTopoFilters("types", toggleFlag(props.values.types, value as TopoTypes))
			}
			/>
			<div>
				<div className="ktext-label text-grey-medium">Nombre de blocs</div>
				<SliderInput
					domain={props.domain.boulderRange}
					values={props.values.boulderRange}
					onChange={(value) => updateTopoFilters("boulderRange", value)}
				/>
			</div>
			<div>
				<div className="ktext-label text-grey-medium">Difficultés</div>
				<GradeSliderInput
					values={props.domain.gradeRange}
					onChange={(range) => updateTopoFilters("gradeRange", range)}
				/>
			</div>
			<Checkbox
				label="Adapté aux enfants"
				checked={props.values.adaptedToChildren}
				onClick={(isChecked) =>
					updateTopoFilters("adaptedToChildren", isChecked)
				}
			/>
		</React.Fragment>
	);

	return (
		<>
			{!open && (
				<RoundButton onClick={() => setOpen(true)}>
					<span className="flex h-full items-center justify-center">
						<FilterIcon className="flex h-6 w-6 flex-col items-center justify-center fill-main stroke-main" />
					</span>
				</RoundButton>
			)}
			{open && (
				<div className="relative z-40 flex min-w-[250px] max-w-[80%] flex-col rounded-lg bg-white shadow md:max-w-[40%]">
					<div
						className={`flex max-w-[150px] flex-row items-center rounded-lg bg-main p-3 pt-4 pl-5 shadow md:cursor-pointer`}
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
