import type { NextPage } from 'next';
import {
  MultipleImageInput,
} from '../components';

const Map: NextPage = () => (
  <div className="bg-grey-light w-screen h-screen">
    <MultipleImageInput
      label="+ ajouter une image"
      values={[]}
      onChange={() => {}}
    />
  </div>
);

export default Map;
