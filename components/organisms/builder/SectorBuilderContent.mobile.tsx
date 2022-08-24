import React from "react";
import { Button } from "components";
import { Topo, UUID } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { SectorListBuilder } from "./SectorListBuilder";
import { useSelectStore } from "components/pages/selectStore";

interface SectorBuilderContentMobileProps {
	topoQuark: Quark<Topo>;
	boulderOrder: Map<UUID, number>;
	map: google.maps.Map | null;
}

export const SectorBuilderContentMobile: React.FC<SectorBuilderContentMobileProps> =
	watchDependencies((props: SectorBuilderContentMobileProps) => {
		const select = useSelectStore(s => s.select);
		const flush = useSelectStore(s => s.flush);

		return (
				<div className="mt-10 flex flex-col overflow-auto px-3 pb-5">
					<SectorListBuilder
						topoQuark={props.topoQuark}
						boulderOrder={props.boulderOrder}
						map={props.map}
					/>

					<div className="flex w-full flex-col items-center">
						<Button
							content="Nouveau secteur"
							className="w-3/4"
							onClick={() => {
								select.tool('SECTOR');
								flush.info();
							}}
						/>
					</div>
				</div>
		);
	});

	SectorBuilderContentMobile.displayName = "SectorBuilderContentMobile";
