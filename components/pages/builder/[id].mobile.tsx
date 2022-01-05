import React, { useMemo, useState } from 'react';
import {
  BoulderSlideoverMobile, Drawer, HeaderMobile, MapControl, BoulderMarker,
} from 'components';
import {
  Boulder,
  SectorData, Topo, TopoData, Track
} from 'types';
import { Quarkify, useCreateQuark, WritableQuark, reactKey } from 'helpers/quarky';
import For from 'components/atoms/utils/For';
import Show from 'components/atoms/utils/Show';

interface BuilderMapMobileProps {
  topo: WritableQuark<Topo>,
}

export const BuilderMapMobile: React.FC<BuilderMapMobileProps> = (props: BuilderMapMobileProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [geoCameraOpen, setGeoCameraOpen] = useState(false);

  // NOTE: testing out how we could select a boulder by a clicking on a map marker
  // We pass selectedBoulder.Set directly to BoulderMarker
  // This is good, since the setter is always the same function
  const selectedBoulder = useCreateQuark<WritableQuark<Boulder>>();
  const selectedTrack = useCreateQuark<WritableQuark<Track>>();

  const topo = props.topo();
  const boulders = useMemo(() => topo.sectors
    .lazy()
    .map(x => x.boulders.quarks())
    .flatten()
  , [topo.sectors]);

  
  return (
    <>
      <HeaderMobile
        title={topo.name}
        backLink="/builder/dashboard"
        menuOptions={[
          // TODO : mettre les actions
          { value: 'Infos du spot', action: () => { } },
          { value: 'Marche d\'approche', action: () => { } },
          { value: 'Gestionnaires du spot', action: () => { } },
          { value: 'Valider le topo', action: () => { } },
          { value: 'Supprimer le topo', action: () => { } },
        ]}
      />

      <div className='h-full relative'>
        <MapControl
          initialZoom={13}
          onPhotoButtonClick={() => setGeoCameraOpen(true)}
          boundsToMarkers
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
                onClick={selectedBoulder.set}
              />
            }
          </For>

          {/* {boulders.map(b =>
            <BoulderMarker
              key={reactKey(b)}
              boulder={b}
              onClick={setSelectedBoulder}
            />
          )} */}
        </MapControl>

        <Show
          when={() => drawerOpen && selectedTrack() && selectedBoulder()}
          fallback={<div>Loading drawer...</div>}
        >
          <Drawer
            image={() => selectedBoulder()!().images[0]}
            track={selectedTrack()!}
            onValidate={() => setDrawerOpen(false)}
          />
        </Show>
        
        {drawerOpen && selectedTrack() && selectedBoulder() &&
          <Drawer
            image={() => selectedBoulder()!().images[0]}
            track={selectedTrack()!}
            onValidate={() => setDrawerOpen(false)}
          />
        }

        {/* TODO */}
        {geoCameraOpen &&
          <></>
        }
      </div>

      {selectedBoulderVal && (
        <BoulderSlideoverMobile
          open
          boulder={selectedBoulderVal}
          selectedTrack={selectedTrackVal}
          topoCreatorId={read(props.topo).creatorId}
          forBuilder
          onPhotoButtonClick={() => setGeoCameraOpen(true)}
          onDrawButtonClick={() => setDrawerOpen(true)}
        />
      )}
    </>
  );
};
