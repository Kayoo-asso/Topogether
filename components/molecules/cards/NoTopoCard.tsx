import React from "react";
import { Card } from "components";
import { TopoStatus } from "types";

interface NoTopoCardProps {
	topoStatus: TopoStatus.Submitted | TopoStatus.Validated;
	content?: string;
}
export const NoTopoCard: React.FC<NoTopoCardProps> = (props: NoTopoCardProps) => (
	<Card className="items-center justify-center text-center text-grey-medium bg-grey-superlight">
		{props.content
			? props.content
			: `Aucun topo ${
					props.topoStatus === TopoStatus.Submitted ? "en attente de validation" : "validé"
			  }`}
	</Card>
);

NoTopoCard.displayName = "TextInput";
