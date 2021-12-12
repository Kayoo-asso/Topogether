import {
  Button,
  Checkbox, Dropdown, GradeCircle, MobileHeader, MobileShell, SatelliteButton,
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
      />

      <Button
        content="Click me"
      />
    </>
  );
};

export default Map;
