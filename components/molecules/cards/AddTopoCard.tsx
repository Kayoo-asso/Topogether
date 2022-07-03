import React from "react";
import { Card } from "components";
import Link from "next/link";
import AddIcon from "assets/icons/add.svg";

// corriger l'icone
export const AddTopoCard: React.FC = () => {
	return (
		<Card className="items-center lg:p-10 text-center text-grey-medium bg-grey-superlight cursor-pointer">
			<Link href="/builder/new">
				<a className="w-full flex flex-col items-center">
					<AddIcon className="stroke-grey-medium fill-white h-16 w-16 stroke-[0.25px]" />
					<span>Créer un topo</span>
				</a>
			</Link>
		</Card>
	);
};
