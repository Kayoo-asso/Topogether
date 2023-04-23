import React, { useState } from "react";
import Image from "next/image";

interface SatelliteButtonProps {
	satellite?: boolean;
	onClick: (displaySatellite: boolean) => void;
}

export const SatelliteButton: React.FC<SatelliteButtonProps> = ({
	satellite = true,
	...props
}: SatelliteButtonProps) => {
	const [displaySatellite, setDisplaySatellite] = useState(satellite);
	return (
		<button
			className="z-20 overflow-hidden rounded-full p-7 shadow"
			onClick={() => {
				props.onClick(displaySatellite);
				setDisplaySatellite((s) => !s);
			}}
		>
			<Image
				src={
					displaySatellite
						? "/assets/img/bg_satellite.jpg"
						: "/assets/img/bg_non-satellite.jpg"
				}
				height={60}
				width={60}
				priority
				alt="Vue satellite"
			/>
		</button>
	);
};
