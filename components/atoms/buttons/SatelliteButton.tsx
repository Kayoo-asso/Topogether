import React, { useState } from 'react';
import Image from 'next/image';

interface SatelliteButtonProps {
  satellite?: boolean,
  onClick: () => void,
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
        setDisplaySatellite(!displaySatellite);
        props.onClick();
      }}
      style={{ height: '60px', width: '60px' }}
    >
      <Image
        src={displaySatellite ? '/assets/img/bg_satellite.jpg' : '/assets/img/bg_non-satellite.jpg'}
        className="rounded-full"
        alt="Vue satellite"
        layout="fill"
        objectFit="cover"
      />
    </button>
  );
};
