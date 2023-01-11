import React, { useState } from "react";
import { GeoCoordinates } from "types";
import { Flash } from ".";
import { launchNavigation } from "helpers/map/mapUtils";
import { Portal, useBreakpoint, useDevice, usePosition } from "helpers/hooks";

interface ParkingModalProps {
	open: boolean;
	parkingLocation: GeoCoordinates;
	onClose: () => void;
}

export const ParkingModal: React.FC<ParkingModalProps> = (
	props: ParkingModalProps
) => {
	const bp = useBreakpoint();
	const { position } = usePosition();
	const [flashMessage, setFlashMessage] = useState<string>();
	const device = useDevice();
	const isIos = device.apple.device;

	return (
		<Portal open={props.open}>
			<div
				className="absolute top-0 left-0 z-full flex h-screen w-screen bg-black bg-opacity-80"
				onClick={props.onClose}
			>
				<div className="absolute left-[50%] bottom-[80px] w-11/12 translate-x-[-50%] shadow">
					<div className={`ktext-base rounded bg-white text-center text-main md:cursor-pointer`}>
						<div
							className="border-b border-grey-light py-5"
							onClick={(e) => {
								e.stopPropagation();
								launchNavigation(
									props.parkingLocation,
									position,
									"google",
									bp,
									isIos
								);
								props.onClose();
							}}
						>
							Google Maps
						</div>
						{isIos && (
							<div
								className="border-b border-grey-light py-5"
								onClick={(e) => {
									e.stopPropagation();
									launchNavigation(
										props.parkingLocation,
										position,
										"apple",
										bp,
										isIos
									);
									props.onClose();
								}}
							>
								Apple Maps
							</div>
						)}
						<div
							className="py-5"
							onClick={(e) => {
								e.stopPropagation();
								const data = [
									new ClipboardItem({
										"text/plain": new Blob(
											[
												props.parkingLocation[1] +
													"," +
													props.parkingLocation[0],
											],
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
							Copier les coordonnées
						</div>
					</div>
					<div className={`ktext-base mt-2 rounded bg-white py-5 text-center text-main md:cursor-pointer`}>
						Annuler
					</div>
				</div>
			</div>
			<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
				{flashMessage}
			</Flash>
		</Portal>
	);
};
