import React from "react";
import { GetHandleProps, SliderItem } from "react-compound-slider";
import { Color } from "types";
import { BaseSlider } from "./BaseSlider";

interface HandleProps {
	color: Color;
	handle: SliderItem;
	getHandleProps: GetHandleProps;
}

const Handle = (props: HandleProps) => (
	<div
		className="absolute z-20 -ml-1 mt-1.5 flex h-6 w-6 content-center items-center rounded-full border-0 bg-main text-center md:cursor-pointer"
		style={{
			left: `${props.handle.percent}%`,
		}}
		{...props.getHandleProps(props.handle.id)}
	>
		<div className="ktext-base w-full text-xs font-bold text-white">
			{props.handle.value}
		</div>
	</div>
);

interface SliderInputProps {
	domain: [number, number];
	values: [number, number];
	step?: number;
	connectTracks?: boolean;
	onChange: (range: [number, number]) => void;
}

export const SliderInput: React.FC<SliderInputProps> = ({
	connectTracks = true,
	...props
}: SliderInputProps) => (
	<BaseSlider
		values={props.values || props.domain}
		step={props.step}
		onChange={props.onChange}
		domain={props.domain}
		connectTracks={connectTracks}
		handleCreator={(handle, getHandleProps) => (
			<Handle
				color="main"
				handle={handle}
				getHandleProps={getHandleProps}
				key={handle.id}
			/>
		)}
	/>
);
