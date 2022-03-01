import React from 'react';
import { Button, SectorListBuilder, SlideoverMobile } from 'components';
import { Boulder, Topo, Track, UUID } from 'types';
import { Quark, watchDependencies, SelectQuarkNullable } from 'helpers/quarky';

interface SectorBuilderSlideoverMobileProps {
    topoQuark: Quark<Topo>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onCreateSector: () => void,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
    onClose: () => void,
}

export const SectorBuilderSlideoverMobile: React.FC<SectorBuilderSlideoverMobileProps> = watchDependencies((props: SectorBuilderSlideoverMobileProps) => {

  return (
    <SlideoverMobile
      open
      onlyFull
      initialFull={true}
      onClose={props.onClose}
    >
      <div className='pt-10 px-3'>
        <SectorListBuilder 
          topoQuark={props.topoQuark}
          boulderOrder={props.boulderOrder}
          selectedBoulder={props.selectedBoulder}
          onBoulderSelect={props.onBoulderSelect}
          onTrackSelect={props.onTrackSelect}
        />

        <div className="w-full flex flex-col items-center">
          <Button 
            content="Nouveau secteur"
            className='w-3/4'
            onClick={() => {
              props.onCreateSector();
              props.onClose();
            }}
          />
        </div>
      </div>
    </SlideoverMobile>
  );
});

SectorBuilderSlideoverMobile.displayName = "SectorBuilderSlideoverMobile";