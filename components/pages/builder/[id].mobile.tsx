import React, { useCallback, useState, useMemo } from 'react';
import {
  BoulderSlideoverMobile, Drawer, HeaderMobile, MapControl,
} from 'components';
import { markerSize } from 'helpers';
import {
  Boulder, Entities, GeoCoordinates, isStringBetween, MarkerProps, Topo, Track, UUID,
} from 'types';
import { Quarkify, useQuark, quark, useQuarkValue, useCreateQuark } from 'helpers/quarky';

interface BuilderMapMobileProps {
  topo: Quarkify<Topo, Entities>,
  // crud: any,
}

export const BuilderMapMobile:React.FC<BuilderMapMobileProps> = (props: BuilderMapMobileProps) => {
  // const [selectedBoulderId, setSelectedBoulderId] = useState<UUID>();
  // const [selectedTrackId, setSelectedTrackId] = useState<UUID>();
  // const [drawerOpen, setDrawerOpen] = useState(false);
  // const [geoCameraOpen, setGeoCameraOpen] = useState(false);

  const selectedTrackQuark = useCreateQuark<UUID | undefined>(undefined);
  const selectedBoulder = useCreateQuark<UUID | undefined>(undefined);
  const drawerOpen = useCreateQuark(false);
  const geoCameraOpen = useCreateQuark(false);

  const selectedTrackId = useQuarkValue(selectedTrackQuark);

  const [topo, setTopo] = useQuark(props.topo);

  function onInput(newTopoName: string) {
    if (!isStringBetween(newTopoName, 1, 255)) throw new Error();
    setTopo({
      ...topo,
      name: newTopoName
    });
  }

  // const getMarkersFromBoulders = () => {
  //   const markers: MarkerProps[] = [];
  //   for (let i = 0; i < props.topo.sectors.length; i++) {
  //     if (props.topo.sectors[i].boulders) {
  //       const sector = props.topo.sectors[i];
  //       for (let j = 0; j < sector.boulders.length; j++) {
  //         const boulder = sector.boulders[j];
  //         markers.push({
  //           id: boulder.id,
  //           options: {
  //             icon: {
  //               url: '/assets/icons/colored/_rock.svg',
  //               scaledSize: markerSize(30),
  //             },
  //             position: boulder.location,
  //             draggable: true,
  //           },
  //           handlers: {
  //             onClick: () => setSelectedBoulderId(boulder.id),
  //             onDragEnd: (e) => {
  //               if (e.latLng) {
  //                 const newCoords: GeoCoordinates = {
  //                   lat: e.latLng.lat(),
  //                   lng: e.latLng.lng(),
  //                 };
  //                 props.crud.boulder.update(i, j, 'location', newCoords);
  //               }
  //             },
  //           },
  //         });
  //       }
  //     }
  //   }
  //   return markers;
  // };

  return (
    <>
      <HeaderMobile
        title={topo.name}
        backLink="/builder/dashboard"
        menuOptions={[
          // TODO : mettre les actions
          { value: 'Infos du spot', action: () => {} },
          { value: 'Marche d\'approche', action: () => {} },
          { value: 'Gestionnaires du spot', action: () => {} },
          { value: 'Valider le topo', action: () => {} },
          { value: 'Supprimer le topo', action: () => {} },
        ]}
      />

      <div className='h-full relative'>
        <MapControl
          initialZoom={13}
          markers={getMarkersFromBoulders()}
          onPhotoButtonClick={() => setGeoCameraOpen(true)}
          boundsToMarkers
          searchbarOptions={{
            findTopos: false,
            findPlaces: false,
          }}
        />

        {drawerOpen && selectedTrackId &&
          <Drawer 
            image={props.topo.sectors[0].boulders[0].images[0]}
            trackId={selectedTrackQuark}
            onValidate={() => setDrawerOpen(false)}
          />
        }

        {/* TODO */}
        {geoCameraOpen &&
          <></>
        }
      </div>

      {selectedBoulderId && (
        <BoulderSlideoverMobile
          open
          boulderId={selectedBoulderId}
          trackId={selectedTrackId}
          topoCreatorId={props.topo.creatorId}
          forBuilder
          onPhotoButtonClick={() => setGeoCameraOpen(true)}
          // onSelectTrack={(trackId) => setSelectedTrackId(trackId)}
          onDrawButtonClick={() => setDrawerOpen(true)}
          // onClose={() => {
          //   setSelectedTrackId(undefined);
          //   setSelectedBoulderId(undefined)
          // }}
        />
      )}
    </>
  );
};
