import {
  Button,
  Checkbox, Dropdown, GradeCircle, Map, MobileHeader,
} from 'components';
import type { NextPage } from 'next';
import { useState } from 'react';

const PageMap: NextPage = () => {
  const [test, setTest] = useState(true);
  return (
    <div className="flex flex-col h-full">

      <MobileHeader
        title="La meilleure app du monde"
        menu={[]}
        onBackClick={() => {}}
      />

      <Map />

    </div>
  );
};

export default PageMap;
