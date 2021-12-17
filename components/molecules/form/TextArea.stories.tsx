import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TextArea } from './TextArea';

export default {
  title: 'TextArea',
  component: TextArea,
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = (args) => <div className="m-20"><TextArea className="w-60" {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  label: 'Description',
  id: 'description',
};

