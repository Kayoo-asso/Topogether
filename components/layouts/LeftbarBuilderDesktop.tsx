import React from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo, UUID } from "types";
import { Map } from "ol";
import { SectorListBuilder } from "components/organisms/builder/SectorListBuilder";
import { Button } from "components/atoms/buttons/Button";

interface LeftbarBuilderDesktopProps {
	topoQuark: Quark<Topo>;
	map: Map | null
	activateSubmission: boolean;
	onSubmit: () => void;
}

export const LeftbarBuilderDesktop: React.FC<LeftbarBuilderDesktopProps> =
	watchDependencies((props: LeftbarBuilderDesktopProps) => {
		
		return (
			<div className="z-500 hidden h-full w-[280px] min-w-[280px] flex-col overflow-auto border-r border-grey-medium bg-white px-6 py-10 md:flex">
				<SectorListBuilder 
					topoQuark={props.topoQuark}
					map={props.map}
				/>

				<div className="text-center">
					<Button
						content="Valider le topo"
						onClick={props.onSubmit}
						fullWidth
					/>
				</div>
			</div>
		);
	});

LeftbarBuilderDesktop.displayName = "LeftbarBuilderDesktop";
