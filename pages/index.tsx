import {
  Button,
  GradeHistogram,
  GradeScale,
  Map, MobileHeader
} from 'components';
import { MobileSlideover } from 'components/atoms/modals/MobileSlideover';
import { fontainebleauLocation } from 'const';
import { Transition } from '@headlessui/react';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';
import type { NextPage } from 'next';
import { useState } from 'react';

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
      content="CLick me"
      onClick={() => isShow(show => !show)}
    />
    <Transition
        show={show}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <MobileSlideover>
          <div></div>
        </MobileSlideover>
      </Transition>
      
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
                onDragEnd: (e) => console.log(e.latLng?.lat())
              },
          }
      ]}
      /> */}

    </div>
  );
};

export default PageMap;
