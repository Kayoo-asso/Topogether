import React from "react";
import Parking from "assets/icons/parking.svg";

interface ParkingButtonProps {
	onClick?: () => void;
}

export const ParkingButton: React.FC<ParkingButtonProps> = ({ ...props }: ParkingButtonProps) => {
	return (
		<div
			className="ktext-base text-main flex flex-row items-center justify-center cursor-pointer"
			onClick={props.onClick}
		>
			Itinéraire vers le parking
			<Parking className="fill-main h-5 w-5 ml-3" />
		</div>
	);
};
