import React, { useEffect, useMemo, useState } from 'react';
import { BoulderMarker, BoulderSlideagainstDesktop, Drawer, For, HeaderDesktop, LeftbarDesktop, MapControl, Show, SlideagainstRightDesktop, SlideoverLeftDesktop } from 'components';
import { MapToolEnum, Topo, Track, Boulder } from 'types';
import { Signal, reactKey, Quark } from 'helpers/quarky';

interface BuilderMapDesktopProps {
    topo: Signal<Topo>,
}

export const BuilderMapDesktop:React.FC<BuilderMapDesktopProps> = (props: BuilderMapDesktopProps) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

    const [currentTool, setCurrentTool] = useState<MapToolEnum>();
    const [selectedBoulder, setSelectedBoulder] = useState<Quark<Boulder>>();
    const [selectedTrack, setSelectedTrack] = useState<Quark<Track>>();

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

    const [displayValidateModal, setDisplayValidateModal] = useState(false);
    const validateTopo = () => {
      {/* TODO */}
    }
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
    const deleteTopo = () => {
      {/* TODO */}
    }

    const topo = props.topo();
    const boulders = useMemo(() => topo.sectors
        .lazy()
        .map(x => x.boulders.quarks())
        .flatten()
        , [topo.sectors]);

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
                displayMapTools
                MapToolsActivated={!selectedTrack}
                currentTool={currentTool}
                onRockClick={() => setCurrentTool('ROCK')}
                onParkingClick={() => setCurrentTool('PARKING')}
                onWaypointClick={() => setCurrentTool('WAYPOINT')}
            />

            <div className='flex flex-row h-full overflow-hidden relative'>
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
                >
                  <For each={boulders.toArray}>
                    {(boulder) =>
                        <BoulderMarker
                            key={reactKey(boulder)}
                            boulder={boulder}
                            onClick={setSelectedBoulder}
                        />
                    }
                  </For>
                </MapControl>

                <Show when={() => drawerOpen && selectedTrack && selectedBoulder}>
                  <Drawer 
                    image={selectedBoulder!().images[0]}
                    tracks={selectedBoulder!().tracks.quarks()}
                    displayedTrackId={selectedTrack!().id}
                    onValidate={() => setDrawerOpen(false)}
                  />
                </Show>

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