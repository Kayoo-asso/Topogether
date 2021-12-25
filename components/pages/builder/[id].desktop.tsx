import React, { useCallback, useEffect, useState } from 'react';
import { BoulderSlideagainstDesktop, HeaderDesktop, LeftbarDesktop, MapControl, SlideagainstRightDesktop, SlideoverLeftDesktop } from 'components';
import { Boulder, Track, GeoCoordinates, MapToolEnum, MarkerProps, Topo } from 'types';
import { markerSize } from 'helpers';

interface BuilderMapDesktopProps {
    topo: Topo,
    crud: any,
}

export const BuilderMapDesktop:React.FC<BuilderMapDesktopProps> = (props: BuilderMapDesktopProps) => {
    const [currentTool, setCurrentTool] = useState<MapToolEnum>();
    const [selectedBoulder, setSelectedBoulder] = useState<Boulder>();
    const [selectedTrack, setSelectedTrack] = useState<Track>();

    const [displayInfoForm, setDisplayInfoForm] = useState<boolean>(false);
    const [displayApproachForm, setDisplayApproachForm] = useState<boolean>(false);
    const [displayManagementForm, setDisplayManagementForm] = useState<boolean>(false);
    const [currentDisplay, setCurrentDisplay] = useState<'INFO' | 'APPROACH' | 'MANAGEMENT'>();
    useEffect(() => {
      if (currentDisplay === 'INFO') {
        setDisplayInfoForm(true);
        setTimeout(() => {
          setDisplayApproachForm(false);
          setDisplayManagementForm(false);
        }, 150)
      } else if (currentDisplay === 'APPROACH') {
        setDisplayApproachForm(true);
        setTimeout(() => {
          setDisplayInfoForm(false);
          setDisplayManagementForm(false)
        }, 150)
      } else if (currentDisplay === 'MANAGEMENT') {
        setDisplayManagementForm(true);
        setTimeout(() => {
          setDisplayInfoForm(false);
          setDisplayApproachForm(false)
        }, 150)
      }
    }, [currentDisplay]);

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

    const [displayValidateModal, setDisplayValidateModal] = useState(false);
    const validateTopo = () => {
      {/* TODO */}
    }
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
    const deleteTopo = () => {
      {/* TODO */}
    }

    return (
        <>
            <HeaderDesktop
                backLink='/builder/dashboard'
                title={props.topo.name}
                menuOptions={[
                    { value: 'Infos du topo', action: () => setCurrentDisplay('INFO')},
                    { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH')},
                    { value: 'Gestionnaires du site', action: () => setCurrentDisplay('MANAGEMENT')},
                    { value: 'Valider le topo', action: () => setDisplayValidateModal(true)},
                    { value: 'Supprimer le topo', action: () => setDisplayDeleteModal(true)}
                ]}
                displayDrawer
                currentTool={currentTool}
                onRockClick={() => setCurrentTool('ROCK')}
                onParkingClick={() => setCurrentTool('PARKING')}
                onWaypointClick={() => setCurrentTool('WAYPOINT')}
            />

            <div className='flex flex-row h-full overflow-hidden'>
                <LeftbarDesktop 
                    currentMenuItem='BUILDER'
                />

                {displayInfoForm &&
                  <SlideoverLeftDesktop 
                    open={displayInfoForm}
                    onClose={() => { setDisplayInfoForm(false) }}
                    className={currentDisplay === 'INFO' ? 'z-100' : ''}
                    title='Infos du spot'
                  /> // TODO : formulaire
                }
                {displayApproachForm &&
                  <SlideoverLeftDesktop 
                    open={displayApproachForm}
                    onClose={() => { setDisplayApproachForm(false) }}
                    className={currentDisplay === 'APPROACH' ? 'z-100' : ''}
                    title="Marche d'approche"
                  /> // TODO : formulaire
                }
                {displayManagementForm &&
                  <SlideoverLeftDesktop 
                    open={displayManagementForm}
                    onClose={() => { setDisplayManagementForm(false) }}
                    className={currentDisplay === 'MANAGEMENT' ? 'z-100' : ''}
                    title='Gestionnaires du spot'
                  /> // TODO : formulaire
                }

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

                {/* TO MODIFY TO PUT FORMS */}
                {selectedTrack &&
                  <SlideagainstRightDesktop 
                    open={!!selectedTrack}
                    onClose={() => setSelectedTrack(undefined)}
                  />
                }
                {selectedBoulder &&
                  <BoulderSlideagainstDesktop
                    boulder={selectedBoulder} 
                    open={!!selectedBoulder}
                    onSelectTrack={(track) => setSelectedTrack(track)}
                    onClose={() => {
                      setSelectedTrack(undefined);
                      setSelectedBoulder(undefined)
                    }}
                  />
                }
                
            </div>
        </>
    )
}