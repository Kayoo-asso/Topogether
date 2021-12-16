import {
  Button,
  GradeHistogram,
  GradeScale,
  Map, MobileHeader
} from 'components';
import { MobileSlideover } from 'components/atoms/modals/MobileSlideover';
import { fontainebleauLocation } from 'const';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import { markerSize } from 'helpers';

const PageMap: NextPage = () => {
  const [show, isShow] = useState(false);

  return (
    <div className="flex flex-col h-full">

      <MobileHeader
        title="La meilleure app du monde"
        menu={[]}
        onBackClick={() => {}}
      />

    <Button 
      content="Click me"
      onClick={() => isShow(show => !show)}
    />
    
      <MobileSlideover
        initialOpen={show}
      >
        <div></div>
      </MobileSlideover>
      
      {/* <Map 
        markers={[
          {
              id: 1234n,
              options: {
                  position: fontainebleauLocation,
                  icon: {
                      url: '/assets/icons/colored/_eraser-main.svg?phantom',
                      scaledSize: markerSize(30)
                  },
                  draggable: true,
              },
              handlers: {
                onDragEnd: useCallback((e) => console.log(e.latLng?.lat()), [])
              },
          }
        ]}
      /> */}

    </div>
  );
};

export default PageMap;
