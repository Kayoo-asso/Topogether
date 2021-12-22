import React, { useState } from 'react';
import Image from 'next/image';

interface SatelliteButtonProps {
  satellite?: boolean,
  onClick: (displaySatellite: boolean) => void,
}

export const SatelliteButton: React.FC<SatelliteButtonProps> = ({
  satellite = true,
  ...props
}: SatelliteButtonProps) => {
  const [displaySatellite, setDisplaySatellite] = useState(satellite);
  return (
    <button
      className="shadow relative rounded-full p-7 z-20"
      onClick={() => {
        props.onClick(displaySatellite);
        setDisplaySatellite(!displaySatellite);  
      }}
      style={{ height: '60px', width: '60px' }}
    >
      <Image
        src={displaySatellite ? '/assets/img/bg_satellite.jpg' : '/assets/img/bg_non-satellite.jpg'}
        className="rounded-full"
        priority
        alt="Vue satellite"
        layout="fill"
        objectFit="cover"
      />
    </button>
  );
};
