import React, { useState } from "react";
import { QuarkArray } from "helpers/quarky";
import { TopoAccess } from "types";
import { DifficultyName } from "types/EnumNames";
import { Image } from "components/atoms/Image";
import { TabOption, Tabs } from "components/layouts/Tabs";

interface AccessContentProps {
	accesses: QuarkArray<TopoAccess>;
}

export const AccessContent: React.FC<AccessContentProps> = (props: AccessContentProps) => {
	const [accessTab, setAccessTab] = useState(0);
	const access = props.accesses
		? props.accesses.toArray()[accessTab]
		: undefined;

	const getTabOptions = (): TabOption[] => {
		const tabs: TabOption[] = [];
		props.accesses.toArray().map((access, index: number) => {
			tabs.push({
				label: "marche " + index,
				color: "main",
				action: () => setAccessTab(index),
			});
		});
		return tabs;
	};

	return (
		<>
			{!access &&
				<div className="flex h-full flex-col pt-5 md:pt-0">
					<div className="flex flex-col px-6 pt-5 md:px-0 md:pt-0">
						<div className="ktext-big-title mt-4 mb-6 w-full text-center md:mb-3">
							Aucune marche d'approche référencée
						</div>
					</div>
				</div>
			}
			{access &&
				<div className="flex h-full flex-col pt-5 md:pt-0">
					<div className="flex flex-col px-6 pt-5 md:px-0 md:pt-0">
						<div className="ktext-big-title mt-4 mb-6 w-full text-center md:hidden">
							{"Marche" +
								(props.accesses.length > 1 ? "s" : "") +
								" d'approche"}
						</div>

						{props.accesses.length > 1 && (
							<Tabs tabs={getTabOptions()} className="pt-2 pb-6 md:pt-8" />
						)}
						<div className="flex flex-row justify-between md:flex-col">
							{access.difficulty !== undefined && (
								<div>
									<span className="font-semibold">Difficulté : </span>
									{DifficultyName[access.difficulty]}
								</div>
							)}
							{access.duration && (
								<div>
									<span className="font-semibold">Durée : </span>
									{access.duration}min
								</div>
							)}
						</div>
					</div>

					<div className="mt-6 flex flex-col overflow-auto px-6 md:px-0">
						{access.steps?.map((step, index) => (
							<div key={index} className="mb-6">
								{access.steps && access.steps.length > 1 && (
									<div className="font-semibold">Etape {index + 1}</div>
								)}
								<div>{step.description}</div>
								{step.image && (
									<div className="relative mt-2 h-[200px] w-auto overflow-hidden rounded-lg">
										<Image
											image={step.image}
											objectFit="contain"
											alt={"Marche d'approche étape " + index}
											sizeHint="90vw"
											modalable
										/>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			}
		</>
	);
};

AccessContent.displayName = 'AccessContent';