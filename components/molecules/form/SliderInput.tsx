import React from 'react';
import { SliderItem } from 'react-compound-slider';
import { Color } from '../../../types';
import { BaseSliderInput } from './BaseSliderInput';

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

interface SliderInputProps {
  name: string,
  domain: number[],
  values: number[],
  step: number,
  connectTracks?: boolean,
  onChange: (e: readonly number[]) => void,
  color: Color;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  connectTracks = true,
  step = 1,
  ...props
}: SliderInputProps) => (
  <BaseSliderInput
    values={props.values || props.domain}
    step={step}
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
