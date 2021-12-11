import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  white: true,
  content: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  white: false,
  content: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  fullWidth: true,
  content: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  fullWidth: false,
  content: 'Button',
};
