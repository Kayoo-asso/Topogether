import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SliderInput } from './SliderInput';

export default {
  title: 'SliderInput',
  component: SliderInput,
} as ComponentMeta<typeof SliderInput>;

const Template: ComponentStory<typeof SliderInput> = (args) => <div className="w-40"><SliderInput {...args} /></div>;

export const Simple = Template.bind({});
Simple.args = {
  onChange: (e) => { console.log(e); },
  domain: [110, 168],
  values: [110, 168],
  step: 1,
};
