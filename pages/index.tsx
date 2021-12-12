import { Dropdown } from 'components';
import type { NextPage } from 'next';

const choices = [
  {
    value: 'dangerous', label: 'Site dangereux', checked: true,
  },
  { value: 'rocky', label: 'Site rocheux' },
];
const Map: NextPage = () => (
  <Dropdown type="checkbox" choices={choices} />
);

export default Map;
