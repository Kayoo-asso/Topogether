import React, { useState } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Waypoint } from "types";
import { Image } from "components/atoms/Image";
import { useSelectStore } from "components/store/selectStore";
import { Flash } from "components/atoms/overlays/Flash";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";

import Info from "assets/icons/info.svg";

export const WaypointContent: React.FC = watchDependencies(() => {
		const [flashMessage, setFlashMessage] = useState<string>();
		const waypoint = useSelectStore(s => s.item.value as Quark<Waypoint>)();

		const flush = useSelectStore(s => s.flush);

		return (
			<>
				<div className="flex h-[90%] flex-col md:h-[85%] md:pt-0">

					<div className="hidden md:block">
						<ItemsHeaderButtons item={waypoint} onClose={flush.item} />
					</div>

					<div className="relative max-h-[40%] h-[40%] overflow-hidden rounded-t-lg w-full md:h-[30%]">
						<Image
							image={waypoint.image}
							alt="Point de repère"
							objectFit="cover"
							sizeHint="50vw"
							modalable
						/>
					</div>

					<div className="flex flex-col gap-6 p-6">
						<div className="flex flex-col items-start">
							<div className="ktext-big-title flex flex-row items-center gap-3">
								<div className="flex h-full items-center justify-center">
									<Info className="h-6 w-6" />
								</div>
								{waypoint.name}
							</div>
						</div>
					
						<div className="ktext-base-little">{waypoint.description}</div>
					</div>
				</div>

				<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
					{flashMessage}
				</Flash>
			</>
		);
	}
);

WaypointContent.displayName = "WaypointContent";
