import React, { useMemo, useState } from 'react';
import {
  BoulderSlideoverMobile, Drawer, HeaderMobile, MapControl, BoulderMarker, For, Show, Map
} from 'components';
import { Boulder, Topo, Track } from 'types';
import { Quark, reactKey, useSelectQuark } from 'helpers/quarky';

interface BuilderMapMobileProps {
  topo: Quark<Topo>,
}

export const BuilderMapMobile: React.FC<BuilderMapMobileProps> = (props: BuilderMapMobileProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [geoCameraOpen, setGeoCameraOpen] = useState(false);

  // const [selectedTrack, setSelectedTrack] = useState<WritableQuark<Track>>();
  // const [selectedBoulder, setSelectedBoulder] = useState<WritableQuark<Boulder>>();
  const selectedTrack = useSelectQuark<Track>();
  const selectedBoulder = useSelectQuark<Boulder>();

  const [selectedTrack2, setSelectedTrack2] = useState<Quark<Track>>();

  // NOTE: testing out how we could select a boulder by a clicking on a map marker
  // We pass selectedBoulder.Set directly to BoulderMarker
  // This is good, since the setter is always the same function
  // const selectedBoulder = useCreateQuark<WritableQuark<Boulder>>();
  // const selectedTrack = useCreateQuark<WritableQuark<Track>>();

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
          center={boulders.toArray()[0]().location}
          boundsToMarkers
          searchbarOptions={{
            findTopos: false,
            findPlaces: false,
          }}
        >
          <For each={() => boulders.toArray()}>
            {(boulder) =>
              <BoulderMarker
                key={reactKey(boulder)}
                boulder={boulder}
                onClick={selectedBoulder.select}
              />
            }
          </For>
        </MapControl>

        <Show when={() => [drawerOpen, selectedBoulder(), selectedTrack()] as const}>
          {([, boulder, track]) =>
            <Drawer
              image={boulder.images[0]}
              tracks={boulder.tracks.quarks()}
              displayedTrackId={track.id}
              onValidate={() => setDrawerOpen(false)}
            />
          }
        </Show>

        {/* TODO */}
        {geoCameraOpen &&
          <></>
        }
      </div>

      <Show when={selectedBoulder.quark}>
        {boulder =>
          <BoulderSlideoverMobile
            open
            boulder={boulder}
            selectedTrack={selectedTrack}
            topoCreatorId={topo.creatorId}
            forBuilder
            onPhotoButtonClick={() => setGeoCameraOpen(true)}
            onDrawButtonClick={() => setDrawerOpen(true)}
            // onSelectTrack={setSelectedTrack}
            // onClose={() => {
            //   selectedBoulder.select(undefined);
            //   selectedTrack.select(undefined);
            // }}
          />
        }
      </Show>
    </>
  );
};
