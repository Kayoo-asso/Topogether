import React from "react";
import { Card } from "components";
import Link from "next/link";
import AddIcon from "assets/icons/add.svg";

// corriger l'icone
export const AddTopoCard: React.FC = () => {
	return (
		<Card className={`items-center bg-grey-superlight text-center text-grey-medium lg:p-10 md:cursor-pointer`}>
			<Link href="/builder/new">
				<a className="flex w-full flex-col items-center">
					<AddIcon className="h-16 w-16 fill-white stroke-grey-medium stroke-[0.25px]" />
					<span>Créer un topo</span>
				</a>
			</Link>
		</Card>
	);
};
