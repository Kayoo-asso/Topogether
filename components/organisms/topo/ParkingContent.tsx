import React, { useState } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Parking } from "types";
import { Image } from "components/atoms/Image";
import { useSelectStore } from "components/pages/selectStore";
import { ParkingButton } from "components/atoms/buttons/ParkingButton";
import { Flash } from "components/atoms/overlays/Flash";
import { ParkingModal } from "components/atoms/overlays/ParkingModal";

import ParkingIcon from "assets/icons/parking.svg";

export const ParkingContent: React.FC = watchDependencies(() => {
		const [flashMessage, setFlashMessage] = useState<string>();
		const [modalParkingOpen, setModalParkingOpen] = useState(false);
		const parkingQuark = useSelectStore(s => s.item.value as Quark<Parking>);
		const parking = parkingQuark();

		return (
			<>
				<div className="flex h-[90%] flex-col gap-6 md:h-[85%] md:pt-0">
					<div className="flex flex-col items-center px-6 md:items-start">
						<div className="ktext-big-title flex flex-row items-center gap-3">
							<ParkingIcon className="h-6 w-6 fill-second" />
							{parking.name || "Parking"}
						</div>
						<div
							className="ktext-label md:cursor-pointer text-grey-medium"
							onClick={() => {
								const data = [
									new ClipboardItem({
										"text/plain": new Blob(
											[parking.location[1] + "," + parking.location[0]],
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
							{parseFloat(parking.location[1].toFixed(12)) +
								"," +
								parseFloat(parking.location[0].toFixed(12))}
						</div>
					</div>

					<div className="relative h-[60%] max-h-[200px] w-full overflow-hidden md:h-[25%]">
						<Image
							image={parking.image}
							alt="Parking"
							sizeHint="50vw"
							objectFit="cover"
							modalable
						/>
					</div>

					<div className="overflow-auto px-6">
						<div>
							<span className="font-semibold">Nombre de places : </span>
							{parking.spaces}
						</div>
						<div className="ktext-base-little mt-2">{parking.description}</div>
					</div>
				</div>
				<div className="absolute bottom-[9%] w-full px-6 text-center md:bottom-6">
					<ParkingButton onClick={() => setModalParkingOpen(true)} />
				</div>

				<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
					{flashMessage}
				</Flash>

				{parking.location && (
					<ParkingModal
						open={modalParkingOpen}
						parkingLocation={parking.location}
						onClose={() => setModalParkingOpen(false)}
					/>
				)}
			</>
		);
	}
);

ParkingContent.displayName = "ParkingContent";
