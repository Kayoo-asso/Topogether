import React, { ReactNode } from "react";
import {
	Slider,
	Handles,
	Rail,
	Tracks,
	SliderItem,
	GetHandleProps,
	GetTrackProps,
} from "react-compound-slider";

interface TrackProps {
	source: { percent: number };
	target: { percent: number };
	getTrackProps: GetTrackProps;
}

const Track = ({ source, target, getTrackProps }: TrackProps) => (
	<div
		className="absolute h-1 z-10 mt-4 rounded-lg bg-grey-medium cursor-pointer"
		style={{
			left: `${source.percent}%`,
			width: `${target.percent - source.percent}%`,
		}}
		{...getTrackProps()}
	/>
);

interface BaseSliderInputProps {
	domain: [number, number];
	values: [number, number];
	step?: number;
	connectTracks?: boolean;
	onChange: (range: [number, number]) => void;
	handleCreator: (
		handle: SliderItem,
		getHandlerProps: GetHandleProps
	) => ReactNode;
}

export const BaseSliderInput: React.FC<BaseSliderInputProps> = ({
	connectTracks = true,
	step = 1,
	...props
}: BaseSliderInputProps) => {
	const { domain } = props;
	if (props.domain[0] === props.domain[1]) {
		domain[1] += 1;
	} else if (domain[0] > domain[1]) {
		domain.reverse();
	}
	return (
		<div className="relative w-[calc(100%-20px)] ml-px h-8">
			<Slider
				domain={domain}
				values={props.values}
				step={step}
				mode={1}
				onChange={(e) => {
					const val: [number, number] = [e[0], e[1]];
					props.onChange(val);
				}}
			>
				<Rail>
					{({ getRailProps }) => (
						<div
							className="absolute w-full h-1 mt-4 rounded-lg bg-grey-light cursor-pointer"
							{...getRailProps()}
						/>
					)}
				</Rail>
				<Handles>
					{({ handles, getHandleProps }) => (
						<div>
							{handles.map((handle) =>
								props.handleCreator(handle, getHandleProps)
							)}
						</div>
					)}
				</Handles>
				{connectTracks && (
					<Tracks left={false} right={false}>
						{({ tracks, getTrackProps }) => (
							<div>
								{tracks.map(({ id, source, target }) => (
									<Track
										key={id}
										source={source}
										target={target}
										getTrackProps={getTrackProps}
									/>
								))}
							</div>
						)}
					</Tracks>
				)}
			</Slider>
		</div>
	);
};
