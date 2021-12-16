import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Icon } from 'components';
import { Dropdown } from './Dropdown';

export default {
  title: 'Dropdown',
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  className: 'w-60',
  choices: [
    { value: 'open', label: 'Ouvrir' },
    { value: 'download', label: 'Télécharger' },
    { value: 'validate', label: 'Envoyer en validation' },
    { value: 'delete', label: 'Supprimer' },
  ],
};

export const WithSections = Template.bind({});
WithSections.args = {
  className: 'w-60',
  choices: [
    { value: 'action', label: 'Action', isSection: true },
    { value: 'open', label: 'Ouvrir' },
    { value: 'download', label: 'Télécharger' },
    { value: 'validate', label: 'Envoyer en validation' },
    { value: 'otherLabels', label: 'Autre label', isSection: true },
    { value: 'delete', label: 'Supprimer' },
  ],
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  className: 'w-60',
  type: 'icon',
  choices: [
    { value: 'Yzéron', icon: 'waypoint' },
    { value: 'Yzédine', icon: 'rock' },
  ],
};

export const WithCheckboxes = Template.bind({});
WithCheckboxes.args = {
  type: 'checkbox',
  className: 'w-60',
  choices: [
    { value: 'dangerous', label: 'Site dangereux', checked: true },
    { value: 'rocky', label: 'Site rocheux' },
  ],
};
