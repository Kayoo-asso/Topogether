import { Dropdown } from 'components';
import type { NextPage } from 'next';

const choices = [
  { value: 'yzeron', label: 'Yzéron', icon: 'waypoint' },
  { value: 'yzedine', label: 'Yzédine', icon: 'rock' },
];
const Map: NextPage = () => (
  <Dropdown choices={choices} />
);

export default Map;
