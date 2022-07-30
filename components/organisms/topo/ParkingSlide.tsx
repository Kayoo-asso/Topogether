import React, { useState } from "react";
import {
	Flash,
	ParkingButton,
	ParkingModal,
	SlideagainstRightDesktop,
	SlideoverMobile,
} from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Parking } from "types";
import { useBreakpoint } from "helpers/hooks";
import { Image } from "components/atoms/Image";

import ParkingIcon from "assets/icons/parking.svg";

interface ParkingSlideProps {
	open: boolean;
	parking: Quark<Parking>;
	onClose?: () => void;
}

export const ParkingSlide: React.FC<ParkingSlideProps> = watchDependencies(
	({ open = true, ...props }: ParkingSlideProps) => {
		const breakpoint = useBreakpoint();

		const [flashMessage, setFlashMessage] = useState<string>();
		const [modalParkingOpen, setModalParkingOpen] = useState(false);
		const parking = props.parking();

		const parkingContent = () => (
			<>
				<div className="flex h-[90%] flex-col gap-6 pt-10 md:h-[85%] md:pt-0">
					<div className="flex flex-col items-center px-6 md:items-start">
						<div className="ktext-big-title flex flex-row items-center gap-3">
							<ParkingIcon className="h-6 w-6 fill-second" />
							{parking.name || "Parking"}
						</div>
						<div
							className="ktext-label cursor-pointer text-grey-medium"
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
				<div className="absolute bottom-[9%] w-full px-6 text-center md:bottom-2">
					<ParkingButton onClick={() => setModalParkingOpen(true)} />
				</div>
			</>
		);

		return (
			<>
				{breakpoint === "mobile" && (
					<SlideoverMobile onClose={props.onClose}>
						{parkingContent()}
					</SlideoverMobile>
				)}
				{breakpoint !== "mobile" && (
					<SlideagainstRightDesktop open onClose={props.onClose}>
						{parkingContent()}
					</SlideagainstRightDesktop>
				)}

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

ParkingSlide.displayName = "ParkingSlide";
