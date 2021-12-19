import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NoTopoCard } from './NoTopoCard';

export default {
  title: 'NoTopoCard',
  component: NoTopoCard,
} as ComponentMeta<typeof NoTopoCard>;

const Template: ComponentStory<typeof NoTopoCard> = () => <NoTopoCard />;

export const Simple = Template.bind({});
