import React, { useCallback, useState } from 'react';
import { HeaderDesktop, LeftbarDesktop, MapControl } from 'components';
import { Boulder, GeoCoordinates, MapToolEnum, MarkerProps, Topo } from 'types';
import { markerSize } from 'helpers';

interface BuilderMapDesktopProps {
    topo: Topo,
    crud: any,
}

export const BuilderMapDesktop:React.FC<BuilderMapDesktopProps> = (props: BuilderMapDesktopProps) => {
    const [currentTool, setCurrentTool] = useState<MapToolEnum>();
    const [selectedBoulder, setSelectedBoulder] = useState<Boulder>();

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
                  onClick: useCallback(() => setSelectedBoulder(boulder), []),
                  onDragEnd: useCallback((e) => {
                    if (e.latLng) {
                      const newCoords: GeoCoordinates = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                      };
                      props.crud.boulder.update(i, j, 'location', newCoords);
                    }
                  }, []),
                },
              });
            }
          }
        }
        return markers;
      };

    return (
        <>
            <HeaderDesktop
                backLink='/builder/dashboard'
                title={props.topo.name}
                menuOptions={[
                    { value: 'Infos du topo', action: () => {} },
                    { value: 'Marche d\'approche', action: () => {} },
                    { value: 'Gestionnaires du site', action: () => {} },
                    { value: 'Valider le topo', action: () => {} },
                    { value: 'Supprimer le topo', action: () => {} }
                ]}
                displayDrawer
                currentTool={currentTool}
                onRockClick={() => setCurrentTool('ROCK')}
                onParkingClick={() => setCurrentTool('PARKING')}
                onWaypointClick={() => setCurrentTool('WAYPOINT')}
            />

            <div className='flex flex-row h-full'>
                <LeftbarDesktop 
                    currentMenuItem='builder'
                />

                <MapControl 
                    initialZoom={13}
                    markers={getMarkersFromBoulders()}
                    boundsToMarkers
                    displayPhotoButton={false}
                    className={
                        currentTool === 'ROCK' ? 'cursor-rock' 
                        : currentTool === 'PARKING' ? 'cursor-parking'
                        : currentTool === 'WAYPOINT' ? 'cursor-waypoint' 
                        : ''
                    } 
                    searchbarOptions={{
                        findTopos: false,
                        findPlaces: false,
                    }}
                />
            </div>
        </>
    )
}