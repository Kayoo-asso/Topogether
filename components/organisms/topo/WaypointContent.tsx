import React, { useState } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Waypoint } from "types";
import { Image } from "components/atoms/Image";
import { useSelectStore } from "components/pages/selectStore";
import { Flash } from "components/atoms/overlays";

import HelpRound from "assets/icons/help-round.svg";

export const WaypointContent: React.FC = watchDependencies(() => {
		const [flashMessage, setFlashMessage] = useState<string>();
		const waypoint = useSelectStore(s => s.item.value as Quark<Waypoint>)();

		return (
			<>
				<div className="flex h-[90%] flex-col gap-6 md:h-[85%] md:pt-0">
					<div className="flex flex-col items-center px-6 md:items-start">
						<div className="ktext-big-title flex flex-row items-center gap-3">
							<div className="flex h-full items-center justify-center">
								<HelpRound className="h-6 w-6 fill-third stroke-third" />
							</div>
							{waypoint.name}
						</div>
						<div
							className="ktext-label cursor-pointer text-grey-medium"
							onClick={() => {
								const data = [
									new ClipboardItem({
										"text/plain": new Blob(
											[waypoint.location[1] + "," + waypoint.location[0]],
											{
												type: "text/plain",
											}
										),
									}),
								];
								navigator.clipboard.write(data).then(
									function () {
										setFlashMessage(
											"Coordonnées copiées dans le presse papier."
										);
									},
									function () {
										setFlashMessage("Impossible de copier les coordonées.");
									}
								);
							}}
						>
							{parseFloat(waypoint.location[1].toFixed(12)) +
								"," +
								parseFloat(waypoint.location[0].toFixed(12))}
						</div>
					</div>

					<div className="relative h-[60%] max-h-[200px] w-full md:h-[25%]">
						<Image
							image={waypoint.image}
							alt="Point de repère"
							objectFit="cover"
							sizeHint="50vw"
							modalable
						/>
					</div>

					<div className="ktext-base-little px-6">{waypoint.description}</div>
				</div>

				<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
					{flashMessage}
				</Flash>
			</>
		);
	}
);

WaypointContent.displayName = "WaypointContent";
