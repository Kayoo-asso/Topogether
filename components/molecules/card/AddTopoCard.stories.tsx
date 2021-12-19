import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { AddTopoCard } from './AddTopoCard';

export default {
  title: 'AddTopoCard',
  component: AddTopoCard,
} as ComponentMeta<typeof AddTopoCard>;

const Template: ComponentStory<typeof AddTopoCard> = () => <AddTopoCard />;

export const Simple = Template.bind({});
