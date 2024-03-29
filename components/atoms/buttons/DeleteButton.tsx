import React from "react";
import Clear from "assets/icons/clear.svg";

interface DeleteButtonProps {
	onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
	
	return (
		<button
			className={`rounded-full border border-dark bg-grey-medium bg-opacity-80 p-0.5 shadow md:cursor-pointer`}
			onClick={props.onClick}
		>
			<Clear className="h-2 w-2 stroke-dark stroke-2" />
		</button>
	)
};
