import {
  BoulderSlideover,
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
  const [show, isShow] = useState(true);

  const test = () => {
    let newFakeTopo = fakeTopo;
    for (let i=0; i<fakeTopo.sectors.length; i++) {
      const sector = fakeTopo.sectors[i];
      for (let j=0; j<sector.boulders.length; j++) {
        const boulder = sector.boulders[j];
        newFakeTopo.sectors[i].boulders[j].orderIndex = j+1;
        for (let k=0; k < boulder.tracks.length; k++) {
          const track = boulder.tracks[k];
          newFakeTopo.sectors[i].boulders[j].tracks[k].orderIndex = k+1;
        }
      }
    }
    console.log(newFakeTopo.sectors);
  }
  // test();

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
    
      <BoulderSlideover 
        boulder={fakeTopo.sectors[0].boulders[0]}
      />
      
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
