import {
  Button,
  Checkbox, Dropdown, GradeCircle, MobileHeader,
} from 'components';
import type { NextPage } from 'next';
import { useState } from 'react';

const Map: NextPage = () => {
  const [test, setTest] = useState(true);
  return (
    <>
      <MobileHeader
        title="La meilleure app du monde"
        menu={[]}
        onBackClick={() => {}}
      />

      <Button
        content="Click me"
      />
    </>
  );
};

export default Map;
