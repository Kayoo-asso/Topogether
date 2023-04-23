import React from "react";
import { GetHandleProps, SliderItem } from "react-compound-slider";
import { LightGrade } from "types";
import { BaseSlider } from "~/components/ui/BaseSlider";
import { GradeCircle } from "~/components/ui/GradeCircle";

interface HandleProps {
	handle: SliderItem;
	getHandleProps: GetHandleProps;
}

const Handle = (props: HandleProps) => (
	<div
		className="absolute z-20 -ml-1 mt-1.5 md:cursor-pointer"
		style={{
			left: `${props.handle.percent}%`,
		}}
		{...props.getHandleProps(props.handle.id)}
	>
		<GradeCircle size="normal" grade={props.handle.value as LightGrade} />
	</div>
);

interface GradeSliderProps {
	values: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">];
	onChange: (
		range: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">]
	) => void;
}

export const GradeSlider: React.FC<GradeSliderProps> = (
	props: GradeSliderProps
) => (
	<BaseSlider
		values={props.values}
		domain={[3, 9]}
		step={1}
		onChange={(range) => {
			props.onChange([
				range[0] as Exclude<LightGrade, "P">,
				range[1] as Exclude<LightGrade, "P">,
			]);
		}}
		handleCreator={(handle, getHandleProps) => (
			<Handle handle={handle} getHandleProps={getHandleProps} key={handle.id} />
		)}
	/>
);
