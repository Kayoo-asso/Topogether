import { getDevice, useDevice } from "~/components/providers/DeviceProvider";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { GeoCoordinates } from "types";
import { Portal } from "~/components/ui/Modal";
import { Flash } from "~/components/ui/Flash";
import { useState } from "react";
import { copyToCliboard } from "~/utils";

interface ParkingModalProps {
	open: boolean;
	parkingLocation: GeoCoordinates;
	onClose: () => void;
}

export function ParkingModal(props: ParkingModalProps) {
	const { position } = usePosition();
	const device = useDevice();
	const [flashMessage, setFlashMessage] = useState<string>();
	// If `device` is null, `isIos` will be false
	const isIos = device?.apple.device;

	return (
		<Portal open={props.open}>
			<div className="absolute left-0 top-0 z-full flex h-screen w-screen bg-black bg-opacity-80">
				<div className="absolute bottom-[80px] left-[50%] w-11/12 translate-x-[-50%] shadow">
					<div
						className={`ktext-base rounded bg-white text-center text-main md:cursor-pointer`}
					>
						<button
							className="border-b border-grey-light py-5"
							onClick={(e) => {
								e.stopPropagation();
								launchNavigation("google", props.parkingLocation, position);
								props.onClose();
							}}
						>
							Google Maps
						</button>
						{isIos && (
							<button
								className="border-b border-grey-light py-5"
								onClick={(e) => {
									e.stopPropagation();
									launchNavigation("apple", props.parkingLocation, position);
									props.onClose();
								}}
							>
								Apple Maps
							</button>
						)}
						<button
							className="py-5"
							onClick={(e) => {
								e.stopPropagation();
								copyToCliboard(
									props.parkingLocation[1] + "," + props.parkingLocation[0],
									{
										onSuccess: () =>
											setFlashMessage(
												"Coordonnées copiées dans le presse papier."
											),
										onError: () =>
											setFlashMessage("Impossible de copier les coordonées."),
									}
								);
							}}
						>
							Copier les coordonnées
						</button>
					</div>
					<button
						className={`ktext-base mt-2 rounded bg-white py-5 text-center text-main md:cursor-pointer`}
						onClick={props.onClose}
					>
						Annuler
					</button>
				</div>
			</div>
			<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
				{flashMessage}
			</Flash>
		</Portal>
	);
}

async function launchNavigation(
	provider: "apple" | "google",
	destination: GeoCoordinates,
	position: GeoCoordinates | null
) {
	const destLng = destination[0];
	const destLat = destination[1];
	// Short timeout, the app should have the user's location if
	// it's accessible by now
	// If `device` is null, `isDesktop` will be true
	const device = getDevice();
	const isDesktop = !device?.phone && !device?.tablet;

	if (provider === "apple") {
		const baseUrl = isDesktop ? "https://maps.apple.com/" : "maps://";
		const url = new URL(baseUrl);
		url.searchParams.set("dirflg", "d");
		url.searchParams.set("daddr", `${destLat},${destLng}`);
		// If we have a position, use it as origin for the itinerary
		if (position) {
			const origLng = position[0];
			const origLat = position[1];
			url.searchParams.set("saddr", `${origLat},${origLng}`);
		}
		window.open(url);
	} else {
		const url = new URL(
			"https://maps.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic"
		);
		url.searchParams.set("destination", `${destLat},${destLng}`);
		if (position) {
			const origLng = position[0];
			const origLat = position[1];
			url.searchParams.set("origin", `${origLat},${origLng}`);
		}
		window.open(url);
	}
}
