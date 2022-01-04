import React, { useMemo, useState } from 'react';
import {
  BoulderSlideoverMobile, Drawer, HeaderMobile, MapControl, BoulderMarker,
} from 'components';
import {
  Boulder,
  SectorData, Topo, TopoData, Track
} from 'types';
import { Quarkify, useQuark, useNewQuark, read, Quark, startQuarkyBatch, useQuarkyBatch, reactKey } from 'helpers/quarky';

interface BuilderMapMobileProps {
  topo: Quark<Topo>,
}

export const BuilderMapMobile: React.FC<BuilderMapMobileProps> = (props: BuilderMapMobileProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [geoCameraOpen, setGeoCameraOpen] = useState(false);

  startQuarkyBatch();

  const selectedBoulderQ = useNewQuark<Quark<Boulder>>();
  // NOTE: testing out how we could select a boulder by a clicking on a map marker
  // We pass setSelectedBoulder directly to BoulderMarker
  // This is good, since the setter is always the same function, thus
  const [selectedBoulderVal, setSelectedBoulder] = useQuark(selectedBoulderQ);
  const selectedTrackQ = useNewQuark<Quark<Track>>();
  const [selectedTrackVal,] = useQuark(selectedTrackQ);

  const [topo,] = useQuark(props.topo);
  const boulderIter = useMemo(() => topo.sectors
    .unwrap() // read the quark for each sector
    .map(x => x.boulders)
    .flatten()
  , [topo.sectors]);
  const boulders = useQuark(boulderIter);

  useQuarkyBatch();
  
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
          {boulders.map(b =>
            <BoulderMarker
              key={reactKey(b)}
              boulder={b}
              onClick={setSelectedBoulder}
            />
          )}
        </MapControl>

        {drawerOpen && selectedTrackVal && selectedBoulderVal &&
          <Drawer
            image={selectedBoulderVal.images[0]}
            track={selectedTrackQ}
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
