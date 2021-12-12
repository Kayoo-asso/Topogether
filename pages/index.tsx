import { Checkbox, Dropdown } from 'components';
import { GradeCircle } from 'components';
import { DrawerToolEnum } from 'enums';
import type { NextPage } from 'next';
import { useState } from 'react';


const Map: NextPage = () => {
  const [test, setTest] = useState(true);
  return (
    <>
      <Checkbox 
        onClick={() => {}}
      />
      <GradeCircle 
        grade="5"
        colored={false}
        selected={test}
        onClick={() => setTest(!test)}
      />
    </>
)};

export default Map;
