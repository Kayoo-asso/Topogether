import React from "react";
import { GradeCircle } from "components";
import { GetHandleProps, SliderItem } from "react-compound-slider";
import { BaseSliderInput } from "./BaseSliderInput";
import { LightGrade } from "types";

interface HandleProps {
	handle: SliderItem;
	getHandleProps: GetHandleProps;
}

const Handle = (props: HandleProps) => (
	<div
		className="absolute z-20 -ml-1 mt-1.5 cursor-pointer"
		style={{
			left: `${props.handle.percent}%`,
		}}
		{...props.getHandleProps(props.handle.id)}
	>
		<GradeCircle size="normal" grade={props.handle.value as LightGrade} />
	</div>
);

interface GradeSliderInputProps {
	values: [Exclude<LightGrade, "None">, Exclude<LightGrade, "None">];
	onChange: (
		range: [Exclude<LightGrade, "None">, Exclude<LightGrade, "None">]
	) => void;
}

export const GradeSliderInput: React.FC<GradeSliderInputProps> = (
	props: GradeSliderInputProps
) => (
	<BaseSliderInput
		values={props.values}
		domain={[3, 9]}
		step={1}
		onChange={(range) => {
			props.onChange([
				range[0] as Exclude<LightGrade, "None">,
				range[1] as Exclude<LightGrade, "None">,
			]);
		}}
		handleCreator={(handle, getHandleProps) => (
			<Handle handle={handle} getHandleProps={getHandleProps} key={handle.id} />
		)}
	/>
);
