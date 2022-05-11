import React from 'react';
import { SectorList, SlideoverMobile } from 'components';
import { Boulder, Topo, Track, UUID } from 'types';
import { Quark, watchDependencies, SelectQuarkNullable } from 'helpers/quarky';

interface SectorSlideoverMobileProps {
    topoQuark: Quark<Topo>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
    onClose: () => void,
}

export const SectorSlideoverMobile: React.FC<SectorSlideoverMobileProps> = watchDependencies((props: SectorSlideoverMobileProps) => {

  return (
    <SlideoverMobile
      onClose={props.onClose}
    >
      <div className='mt-10 px-3 overflow-auto pb-5'>
        <SectorList 
          topoQuark={props.topoQuark}
          boulderOrder={props.boulderOrder}
          selectedBoulder={props.selectedBoulder}
          onBoulderSelect={props.onBoulderSelect}
          onTrackSelect={props.onTrackSelect}
        />
      </div>
    </SlideoverMobile>
  );
});

SectorSlideoverMobile.displayName = "SectorSlideoverMobile";