import { BoulderSlideagainstDesktop, HeaderDesktop, LeftbarDesktop, MapControl, SlideagainstRightDesktop, SlideoverLeftDesktop } from 'components';
import { markerSize } from 'helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { Boulder, MarkerProps, Topo, Track } from 'types';

interface TopoDesktopProps {
    topo: Topo,
}

export const TopoDesktop: React.FC<TopoDesktopProps> = (props: TopoDesktopProps) => {
    const [selectedBoulder, setSelectedBoulder] = useState<Boulder>();
    const [selectedTrack, setSelectedTrack] = useState<Track>();

    const [displayInfo, setDisplayInfo] = useState<boolean>(false);
    const [displayApproach, setDisplayApproach] = useState<boolean>(false);
    const [displayManagement, setDisplayManagement] = useState<boolean>(false);
    const [currentDisplay, setCurrentDisplay] = useState<'INFO' | 'APPROACH' | 'MANAGEMENT'>();
    useEffect(() => {
      if (currentDisplay === 'INFO') {
        setDisplayInfo(true);
        setTimeout(() => {
          setDisplayApproach(false);
          setDisplayManagement(false);
        }, 150)
      } else if (currentDisplay === 'APPROACH') {
        setDisplayApproach(true);
        setTimeout(() => {
          setDisplayInfo(false);
          setDisplayManagement(false)
        }, 150)
      } else if (currentDisplay === 'MANAGEMENT') {
        setDisplayManagement(true);
        setTimeout(() => {
          setDisplayInfo(false);
          setDisplayApproach(false)
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
                backLink="/"
                title={props.topo.name}
                menuOptions={[
                    { value: 'Infos du topo', action: () => setCurrentDisplay('INFO')},
                    { value: 'Marche d\'approche', action: () => setCurrentDisplay('APPROACH')},
                    { value: 'Gestionnaires du site', action: () => setCurrentDisplay('MANAGEMENT')},
                ]}
            />

            <div className="flex flex-row h-full">
                <LeftbarDesktop
                    currentMenuItem="MAP"
                />

                {displayInfo &&
                  <SlideoverLeftDesktop 
                    open={displayInfo}
                    onClose={() => { setDisplayInfo(false) }}
                    className={currentDisplay === 'INFO' ? 'z-100' : ''}
                    title='Infos du spot'
                  /> // TODO : Infos
                }
                {displayApproach &&
                  <SlideoverLeftDesktop 
                    open={displayApproach}
                    onClose={() => { setDisplayApproach(false) }}
                    className={currentDisplay === 'APPROACH' ? 'z-100' : ''}
                    title="Marche d'approche"
                  /> // TODO : Marche d'approche
                }
                {displayManagement &&
                  <SlideoverLeftDesktop 
                    open={displayManagement}
                    onClose={() => { setDisplayManagement(false) }}
                    className={currentDisplay === 'MANAGEMENT' ? 'z-100' : ''}
                    title='Gestionnaires du spot'
                  /> // TODO : Gestionnaires du spot
                }

                <MapControl 
                    initialZoom={13}
                    markers={getMarkersFromBoulders()}
                    boundsToMarkers
                    displayPhotoButton={false}
                    searchbarOptions={{
                        findTopos: false,
                        findPlaces: false,
                    }}
                />

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