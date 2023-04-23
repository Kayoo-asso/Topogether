import React, { useState } from "react";
import { GeoCoordinates } from "types";
import { launchNavigation } from "helpers/map/mapUtils";
import { useBreakpoint, useDevice } from "helpers/hooks/DeviceProvider";
import { usePosition } from "helpers/hooks/UserPositionProvider";
import { Portal } from "helpers/hooks/useModal";
import { Flash } from "./Flash";

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
				className="absolute z-full flex flex-col justify-end items-center h-screen w-screen bg-black bg-opacity-80"
				onClick={props.onClose}
			>
				<div className="w-11/12 shadow">	
					<div className="ktext-base flex flex-col rounded bg-white border border-grey-light text-center text-main">
						<div
							className="py-5"
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
