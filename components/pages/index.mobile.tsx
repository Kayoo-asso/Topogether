import { BoulderSlideover, Button, Map, MobileHeader } from 'components';
import { GeoCamera } from 'components/molecules/GeoCamera';
import { fontainebleauLocation } from 'const';
import { markerSize } from 'helpers';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';
import React, { useCallback, useState } from 'react';

export const WorldMapMobile:React.FC = (props) => {
    const [show, isShow] = useState(true);

    const test = () => {
    let newFakeTopo = fakeTopo;
    for (let i=0; i<fakeTopo.sectors.length; i++) {
        const sector = fakeTopo.sectors[i];
        if (sector.boulders) {
        for (let j=0; j < sector.boulders.length; j++) {
            const boulder = sector.boulders[j];
            // newFakeTopo.sectors[i].boulders[j].orderIndex = j+1;
            if (boulder.tracks) {
            for (let k=0; k < boulder.tracks.length; k++) {
                const track = boulder.tracks[k];
                // delete newFakeTopo.sectors[i].boulders[j].tracks[k].orientationIds;
            }
            }
        }
        }
    }
    console.log(newFakeTopo.sectors);
    }
    // test();

  return (    
      <>
        <MobileHeader
          title="La meilleure app du monde"
          menu={[]}
          onBackClick={() => {}}
        />

        <GeoCamera 
          open
          // onCapture={(blob) => console.log(blob)}
        />
      
        {/* <BoulderSlideover 
          boulder={fakeTopo.sectors[0].boulders[0]}
          topoCreatorId={3}
          forBuilder
        /> */}
        
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

      </>
  )
};