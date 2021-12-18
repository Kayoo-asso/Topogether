import React from 'react';
import {
  Slider, Handles, Rail, Tracks, SliderItem,
} from 'react-compound-slider';
import { Color } from '../../../types';

interface HandleProps {
  color: Color,
  handle: SliderItem,
  getHandleProps: (id: string) => void
}

const Handle = (props: HandleProps) => (
  <div
    className="absolute -ml-1 mt-1.5 z-20 w-6 h-6 border-0 text-center bg-main rounded-full cursor-pointer flex items-center content-center"
    style={{
      left: `${props.handle.percent}%`,
    }}
    {...props.getHandleProps(props.handle.id)}
  >
    <div className="text-white w-full ktext-base text-xs font-bold">
      {props.handle.value}
    </div>
  </div>
);

interface TrackProps {
  source: { percent: number },
  target: { percent: number },
  getTrackProps: () => void
}

const Track = ({ source, target, getTrackProps }:TrackProps) => (
  <div
    className="absolute h-1 z-10 mt-4 rounded-lg bg-grey-medium cursor-pointer"
    style={{
      left: `${source.percent}%`,
      width: `${target.percent - source.percent}%`,
    }}
    {...getTrackProps()}
  />
);

interface SliderInputProps {
  name: string,
  domain?: number[],
  values: number[],
  step: number,
  connectTracks?: boolean,
  onChange: (e: readonly number[]) => void,
  color: Color;
  handleColors: { [color: string]: Color }
}

export const SliderInput = ({
  domain = [3, 7],
  connectTracks = true,
  color = 'main',
  ...props
}: SliderInputProps) => {
  if (domain[0] === domain[1]) {
    domain[1]++;
  } else if (domain[0] > domain[1]) {
    domain.reverse();
  }
  return (
    <div
      id={`slider-${props.name}`}
      className="relative w-full ml-px h-8"
    >
      <Slider
        domain={domain}
        values={props.values}
        step={props.step}
        mode={1}
        onChange={(e) => props.onChange(e)}
      >
        <Rail>
          {({ getRailProps }) => (
            <div className="absolute w-full h-1 mt-4 rounded-lg bg-grey-light cursor-pointer" {...getRailProps()} />
          )}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="">
              {handles.map((handle) => (
                <Handle
                  color={color}
                  key={handle.id}
                  handle={handle}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        {connectTracks && (
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="">
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
