import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GradeSliderInput } from './GradeSliderInput';

export default {
  title: 'GradeSliderInput',
  component: GradeSliderInput,
} as ComponentMeta<typeof GradeSliderInput>;

const Template: ComponentStory<typeof GradeSliderInput> = (args) => <div className="w-40"><GradeSliderInput {...args} /></div>;

export const Simple = Template.bind({});
Simple.args = {
  onChange: (e) => { console.log(e); },
};
