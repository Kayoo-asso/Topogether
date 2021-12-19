import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';
import { TopoCard } from './TopoCard.desktop';

export default {
  title: 'TopoCard',
  component: TopoCard,
} as ComponentMeta<typeof TopoCard>;

const Template: ComponentStory<typeof TopoCard> = (args) => <TopoCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  topo: fakeLightTopo,
};
