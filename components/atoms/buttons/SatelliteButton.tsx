import React, { useState } from 'react';
import Image from 'next/image';

interface SatelliteButtonProps {
  satellite?: boolean,
  onClick: () => void,
}

export const SatelliteButton: React.FC<SatelliteButtonProps> = ({
  satellite = false,
  ...props
}: SatelliteButtonProps) => {
  const [displaySatellite, setDisplaySatellite] = useState(satellite);
  return (
    <button
      className="shadow relative rounded-full p-6"
      onClick={() => {
        setDisplaySatellite(!displaySatellite);
        props.onClick();
      }}
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
