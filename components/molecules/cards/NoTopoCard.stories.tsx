import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TopoStatus } from 'types';
import { NoTopoCard } from './NoTopoCard';

export default {
  title: 'NoTopoCard',
  component: NoTopoCard,
} as ComponentMeta<typeof NoTopoCard>;

const Template: ComponentStory<typeof NoTopoCard> = () => <NoTopoCard topoStatus={TopoStatus.Submitted} />;

export const Simple = Template.bind({});
