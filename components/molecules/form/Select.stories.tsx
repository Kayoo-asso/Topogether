import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Select } from './Select';

export default {
  title: 'Select',
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  className: 'w-60',
  label: 'Type de roche',
  choices: [
    { value: 'andesite', label: 'Andésite' },
    { value: 'basalt', label: 'Basalte' },
  ],
};
