import React, { useState } from 'react';
import {
  BoulderSlideoverMobile, Drawer, HeaderMobile, MapControl, BoulderMarker,
} from 'components';
import {
  BoulderQuark, Entities, Topo, TrackQuark
} from 'types';
import { Quarkify, useQuark, useQuarkValue, useCreateQuark, read, useInlineDerivation } from 'helpers/quarky';

interface BuilderMapMobileProps {
  topo: Quarkify<Topo, Entities>,
}

export const BuilderMapMobile: React.FC<BuilderMapMobileProps> = (props: BuilderMapMobileProps) => {
  const selectedBoulderQ = useCreateQuark<BoulderQuark>();
  const selectedBoulderVal = useQuarkValue(selectedBoulderQ);
  const selectedTrackQ = useCreateQuark<TrackQuark>();
  const selectedTrackVal = useQuarkValue(selectedTrackQ);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [geoCameraOpen, setGeoCameraOpen] = useState(false);

  const topo = useQuarkValue(props.topo);
  const boulderQuarks = useInlineDerivation(() =>
    topo.sectors
      .map(read)
      .flatMap(x => x.boulders)
  );

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
          {boulderQuarks.map(boulder =>
            <BoulderMarker
              boulder={boulder}
            />
          )}
        </MapControl>

        {drawerOpen && selectedTrackVal && selectedBoulderVal &&
          <Drawer
            image={read(read(selectedBoulderVal).images[0])}
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
