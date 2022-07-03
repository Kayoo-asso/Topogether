import React from "react";
import Clear from "assets/icons/clear.svg";

interface DeleteButtonProps {
	onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = (props) => (
	<button
		className="shadow rounded-full p-0.5 border-dark border bg-grey-medium bg-opacity-80 cursor-pointer"
		onClick={props.onClick}
	>
		<Clear className="h-2 w-2 stroke-dark stroke-2" />
	</button>
);
