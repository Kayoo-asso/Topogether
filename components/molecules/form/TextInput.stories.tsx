import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TextInput } from './TextInput';

export default {
  title: 'TextInput',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => <div className="m-20"><TextInput className="w-60" {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  label: 'Description',
  id: 'description',
};

export const Number = Template.bind({});
Number.args = {
  label: 'Nombre de degaine',
  id: 'DegaineNumber',
  type: 'number',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Nom du topo',
  id: 'topoName',
  error: 'Cette valeur ne doit pas être vide',
};
