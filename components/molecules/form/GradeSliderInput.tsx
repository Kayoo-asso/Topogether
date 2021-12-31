import React from 'react';
import { GradeCircle } from 'components';
import { SliderItem } from 'react-compound-slider';
import { BaseSliderInput } from './BaseSliderInput';

interface HandleProps {
  handle: SliderItem,
  getHandleProps: (id: string) => void
}

// TODO, possible solution: `props.handle.value as LightGrade`, if we are certain the domain is correct
const Handle = (props: HandleProps) => (
  <div
    className="absolute -ml-1 mt-1.5 z-20 cursor-pointer"
    style={{
      left: `${props.handle.percent}%`,
    }}
    {...props.getHandleProps(props.handle.id)}
  >
    <GradeCircle size="little" grade={props.handle.value} />
  </div>
);

interface GradeSliderInputProps {
  onChange: (e: readonly number[]) => void,
}

export const GradeSliderInput: React.FC<GradeSliderInputProps> = ({
  ...props
}: GradeSliderInputProps) => (
  <BaseSliderInput
    values={[3, 9]}
    domain={[3, 9]}
    step={1}
    onChange={props.onChange}
    handleCreator={(handle, getHandleProps) => (
      <Handle
        handle={handle}
        getHandleProps={getHandleProps}
        key={handle.id}
      />
    )}
  />
);
