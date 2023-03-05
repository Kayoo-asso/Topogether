import React, { useState } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Parking } from "types";
import { Image } from "components/atoms/Image";
import { useSelectStore } from "components/store/selectStore";
import { ParkingButton } from "components/atoms/buttons/ParkingButton";
import { Flash } from "components/atoms/overlays/Flash";
import { ParkingModal } from "components/atoms/overlays/ParkingModal";

import ParkingIcon from "assets/icons/parking.svg";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";

export const ParkingContent: React.FC = watchDependencies(() => {
		const [flashMessage, setFlashMessage] = useState<string>();
		const [modalParkingOpen, setModalParkingOpen] = useState(false);
		const parkingQuark = useSelectStore(s => s.item.value as Quark<Parking>);
		const parking = parkingQuark();

		const flush = useSelectStore(s => s.flush);

		return (
			<>
				<div className="flex h-[90%] flex-col md:h-[85%] md:pt-0">

					<div className="hidden md:block">
						<ItemsHeaderButtons item={parking} onClose={flush.item} />
					</div>

					<div className="relative max-h-[40%] h-[40%] w-full overflow-hidden rounded-t-lg md:rounded-none md:h-[30%]">
						<Image
							image={parking.image}
							alt="Parking"
							sizeHint="50vw"
							objectFit="cover"
							modalable
						/>
					</div>
					
					<div className="flex flex-col gap-6 p-6">
						<div className="flex flex-col items-start">
							<div className="ktext-big-title flex flex-row items-center gap-3">
								<ParkingIcon className="h-6 w-6" />
								{parking.name || "Parking"}
							</div>
						</div>

						<div className="overflow-auto">
							<div>
								<span className="font-semibold">Nombre de places : </span>
								{parking.spaces}
							</div>
							<div className="ktext-base-little mt-2">{parking.description}</div>
						</div>
					</div>

				</div>
				<div className="absolute bottom-[10%] w-full px-6 text-center md:bottom-6">
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
