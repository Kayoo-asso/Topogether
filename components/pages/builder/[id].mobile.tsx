import React, { useCallback, useState } from 'react';
import {
  BoulderSlideoverMobile, Drawer, HeaderMobile, MapControl,
} from 'components';
import { markerSize } from 'helpers';
import {
  Boulder, GeoCoordinates, MarkerProps, Topo, Track,
} from 'types';

interface BuilderMapMobileProps {
  topo: Topo,
  crud: any,
}

export const BuilderMapMobile:React.FC<BuilderMapMobileProps> = (props: BuilderMapMobileProps) => {
  const [selectedBoulder, setSelectedBoulder] = useState<Boulder>();
  const [selectedTrack, setSelectedTrack] = useState<Track>();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const getMarkersFromBoulders = () => {
    const markers: MarkerProps[] = [];
    for (let i = 0; i < props.topo.sectors.length; i++) {
      if (props.topo.sectors[i].boulders) {
        const sector = props.topo.sectors[i];
        for (let j = 0; j < sector.boulders.length; j++) {
          const boulder = sector.boulders[j];
          markers.push({
            id: boulder.id,
            options: {
              icon: {
                url: '/assets/icons/colored/_rock.svg',
                scaledSize: markerSize(30),
              },
              position: boulder.location,
              draggable: true,
            },
            handlers: {
              onClick: () => setSelectedBoulder(boulder),
              onDragEnd: (e) => {
                if (e.latLng) {
                  const newCoords: GeoCoordinates = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  };
                  props.crud.boulder.update(i, j, 'location', newCoords);
                }
              },
            },
          });
        }
      }
    }
    return markers;
  };

  return (
    <>
      <HeaderMobile
        title={props.topo.name}
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
          onPhotoButtonClick={() => {
            // TODO
          }}
          boundsToMarkers
          searchbarOptions={{
            findTopos: false,
            findPlaces: false,
          }}
        />

        {drawerOpen &&
          <Drawer 
            image={props.topo.sectors[0].boulders[0].images[0]}
            track={props.topo.sectors[0].boulders[0].tracks[0]}
          />
        }
      </div>

      {selectedBoulder && (
        <BoulderSlideoverMobile
          open
          boulder={selectedBoulder}
          forBuilder
          onClose={() => setSelectedBoulder(undefined)}
        />
      )}
    </>
  );
};
