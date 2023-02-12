import React from "react";
import Parking from "assets/icons/parking.svg";

interface ParkingButtonProps {
	onClick?: () => void;
	displayIcon?: boolean;
}

export const ParkingButton: React.FC<ParkingButtonProps> = ({
	displayIcon = false,
	...props
}: ParkingButtonProps) => {
	
	return (
		<div
			className={`ktext-base flex flex-row items-center justify-center text-main md:cursor-pointer`}
			onClick={props.onClick}
		>
			Itinéraire vers le parking
			{displayIcon && <Parking className="ml-3 h-5 w-5" />}
		</div>
	);
};
