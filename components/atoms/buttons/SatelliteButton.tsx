import React, { useState } from "react";
import NextImage from "next/image";

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
			className="relative z-20 h-[60px] w-[60px] rounded-full p-7 shadow"
			onClick={() => {
				props.onClick(displaySatellite);
				setDisplaySatellite(s => !s);
			}}
		>
			<NextImage
				src={
					displaySatellite
						? "/assets/img/bg_satellite.jpg"
						: "/assets/img/bg_non-satellite.jpg"
				}
				className="rounded-full"
				priority
				alt="Vue satellite"
				layout="fill"
				objectFit="cover"
			/>
		</button>
	);
};
