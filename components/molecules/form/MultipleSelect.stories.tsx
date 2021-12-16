import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Select } from './Select';

export default {
  title: 'Select',
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select className="w-60" {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  label: 'Type de roche',
  choices: [
    { value: 'andesite', label: 'Andésite' },
    { value: 'basalt', label: 'Basalte' },
  ],
};
