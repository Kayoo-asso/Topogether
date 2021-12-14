import {
  GradeHistogram,
  GradeScale,
  Map, MobileHeader,
} from 'components';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';
import type { NextPage } from 'next';

const PageMap: NextPage = () => {

  return (
    <div className="flex flex-col h-full">

      <MobileHeader
        title="La meilleure app du monde"
        menu={[]}
        onBackClick={() => {}}
      />

      <GradeHistogram 
        topo={fakeTopo}
      />
      
      {/* <Map /> */}

    </div>
  );
};

export default PageMap;
