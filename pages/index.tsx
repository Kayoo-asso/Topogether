import {
  GradeScale,
  Map, MobileHeader,
} from 'components';
import type { NextPage } from 'next';
import { useState } from 'react';

const PageMap: NextPage = () => {

  return (
    <div className="flex flex-col h-full">

      <MobileHeader
        title="La meilleure app du monde"
        menu={[]}
        onBackClick={() => {}}
      />

      <GradeScale
        grades={[3,4,5,6,7]}
        unselectedGrades={[5,6]}
        clickable
      />
      
      {/* <Map /> */}

    </div>
  );
};

export default PageMap;
