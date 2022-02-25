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
      open
      onlyFull
      initialFull={true}
      onClose={props.onClose}
    >
      <div className='pt-10 px-3'>
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