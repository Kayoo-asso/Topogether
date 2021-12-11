import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
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
