import React, { useCallback, useState } from "react";
import { Checkbox, RoundButton } from "components";
import { LightGrade, TopoType } from "types";
import { GradeSliderInput, MultipleSelect, SliderInput } from "..";
import { TopoTypeName } from "types/EnumNames";
import FilterIcon from "assets/icons/filter.svg";

export interface TopoFilterOptions {
	types: TopoType[];
	boulderRange: [number, number];
	gradeRange: [Exclude<LightGrade, "None">, Exclude<LightGrade, "None">];
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
		<K extends keyof TopoFilterOptions>(option: K, value: TopoFilterOptions[K]) => {
			props.onChange({
				...props.values,
				[option]: value,
			});
		},
		[props.values]
	);

	const updateTypeFilters = useCallback(
		(value: TopoType) => {
			if (props.values.types.includes(value)) {
				props.onChange({
					...props.values,
					types: props.values.types.filter((v) => v !== value),
				});
			} else {
				props.onChange({
					...props.values,
					types: [...props.values.types, value],
				});
			}
		},
		[props.values]
	);

	const renderFilters = () => (
		<React.Fragment>
			<MultipleSelect<number>
				id="topo-types"
				label="Types de spot"
				options={Object.entries(TopoTypeName).map(([stringValue, label]) => ({
					value: +stringValue,
					label,
				}))}
				values={props.values.types || []}
				onChange={updateTypeFilters}
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
				onClick={(isChecked) => updateTopoFilters("adaptedToChildren", isChecked)}
			/>
		</React.Fragment>
	);

	return (
		<>
			{!open && (
				<RoundButton onClick={() => setOpen(true)}>
					<span className="h-full flex items-center justify-center">
						<FilterIcon className="h-6 w-6 flex flex-col items-center justify-center stroke-main fill-main" />
					</span>
				</RoundButton>
			)}
			{open && (
				<div className="bg-white z-40 relative shadow rounded-lg flex flex-col max-w-[60%] md:max-w-[40%] min-w-[250px]">
					<div
						className="flex flex-row items-center shadow bg-main rounded-lg p-3 pt-4 pl-5 cursor-pointer max-w-[150px]"
						onClick={() => setOpen(false)}
					>
						<FilterIcon className="h-6 w-6 stroke-white fill-white" />
						<div className="text-white ktext-subtitle ml-3">Filtres</div>
					</div>

					<div className="flex flex-col gap-6 min-h-[100px] p-5 pb-8">{renderFilters()}</div>
				</div>
			)}
		</>
	);
};
