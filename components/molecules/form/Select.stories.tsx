import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MultipleSelect } from './MultipleSelect';

export default {
  title: 'MultipleSelect',
  component: MultipleSelect,
} as ComponentMeta<typeof MultipleSelect>;

const Template: ComponentStory<typeof MultipleSelect> = (args) => <MultipleSelect className="w-60" {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  label: 'Equipement des blocs',
  defaultChoices: [
    { value: 'Dégaines' },
    { value: 'Cordes' },
  ],
};
