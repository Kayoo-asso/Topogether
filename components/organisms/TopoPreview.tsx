import React, { useState } from "react";
import {
	Button,
	DownloadButton,
	Flash,
	LikeButton,
	GradeHistogram,
	ParkingButton,
	ParkingModal,
	SlideagainstRightDesktop,
} from "components";
import { LightTopo } from "types";
import { encodeUUID } from "helpers/utils";
import { CFImage } from "components/atoms/CFImage";
import Rock from "assets/icons/rock.svg";
import ManyTracks from "assets/icons/many-tracks.svg";
import Waypoint from "assets/icons/waypoint.svg";
import { ModalBG } from "components/atoms";
import Copy from "/assets/icons/copy.svg";
import { TopoTypeToColor } from "helpers/topo";

interface TopoPreviewProps {
	topo: LightTopo;
	open?: boolean;
	onClose: () => void;
}

export const TopoPreview: React.FC<TopoPreviewProps> = (
	props: TopoPreviewProps
) => {
	const [modalParkingOpen, setModalParkingOpen] = useState(false);
	const [flashMessage, setFlashMessage] = useState<string>();
	const topo = props.topo;

	const coordinateItem = () => (
		<div
			className="ktext-label cursor-pointer text-grey-medium"
			onClick={() => {
				const data = [
					new ClipboardItem({
						"text/plain": new Blob(
							[topo.location[1] + "," + topo.location[0]],
							{
								type: "text/plain",
							}
						),
					}),
				];
				navigator.clipboard.write(data).then(
					function () {
						setFlashMessage("Coordonnées copiées dans le presse papier.");
					},
					function () {
						setFlashMessage("Impossible de copier les coordonées.");
					}
				);
			}}
		>
			{parseFloat(topo.location[1].toFixed(12)) +
				"," +
				parseFloat(topo.location[0].toFixed(12))}
		</div>
	);

	const topoPreviewContent = () => (
		<>
			<div className="absolute top-2 right-2 z-100 flex flex-row justify-center gap-5 rounded-full bg-white px-4 py-2 md:hidden">
				<LikeButton liked={props.topo.liked} />
				<DownloadButton topo={props.topo} />
			</div>

			<div className="absolute top-2 left-2 z-100 flex max-w-[60%] flex-row gap-2 overflow-hidden rounded-full bg-white px-4 py-2 md:hidden">
				<div>
					<Copy className="h-5 w-5 stroke-main" />
				</div>
				{coordinateItem()}
			</div>

			<div className="flex flex-col">
				<div className="h-[200px] w-full overflow-hidden">
					<CFImage
						image={topo.image}
						objectFit="cover"
						className="flex"
						alt="image principale du topo"
						sizeHint="70vw"
						modalable
					/>
				</div>

				<div className="ktext-section-title mt-4 flex flex-row items-center px-4">
					<Waypoint className={"h-6 w-6 " + TopoTypeToColor(topo.type)} />
					<div className="ml-2">{topo.name}</div>
				</div>
				{topo.closestCity && topo.closestCity !== topo.name && (
					<div className="ktext-label px-4 text-grey-medium md:text-left">
						{topo.closestCity}
					</div>
				)}
				<div className="hidden px-4 md:block">{coordinateItem()}</div>

				<div className="ktext-base-little hide-after-three-lines overflow-hidden px-4">
					{topo.description}
				</div>

				<div className="flex flex-row px-4 pt-4 md:flex-col md:pt-10">
					<div className="flex w-1/3 flex-col gap-3 md:w-full md:flex-row md:justify-around">
						<div className="flex flex-row pt-6 md:pt-0">
							<Rock className="h-6 w-6 stroke-dark" />
							<div className="ml-2">{topo.nbBoulders} blocs</div>
						</div>
						<div className="flex flex-row">
							<ManyTracks className="h-6 w-6 stroke-dark" />
							<div className="ml-2">{topo.nbTracks} voies</div>
						</div>
					</div>

					<div className="flex w-2/3 items-end justify-end md:mt-5 md:h-[120px] md:w-full md:justify-center">
						<GradeHistogram topo={topo} size="little" />
					</div>
				</div>

				<div className="flex w-full flex-col md:absolute md:bottom-0">
					<div className="mt-4 w-full p-4">
						<Button
							content="Entrer"
							fullWidth
							href={"/topo/" + encodeUUID(topo.id)}
						/>
					</div>
					{topo.parkingLocation && (
						<div className="pb-4">
							<ParkingButton onClick={() => setModalParkingOpen(true)} />
						</div>
					)}
				</div>
			</div>
		</>
	);

	return (
		<>
			<div className="md:hidden">
				<ModalBG onBgClick={props.onClose}>{topoPreviewContent()}</ModalBG>
			</div>
			<div className="hidden md:block">
				<SlideagainstRightDesktop
					open
					displayLikeButton
					displayDlButton
					item={props.topo}
					onClose={props.onClose}
				>
					{topoPreviewContent()}
				</SlideagainstRightDesktop>
			</div>

			{topo.parkingLocation && (
				<ParkingModal
					open={modalParkingOpen}
					parkingLocation={topo.parkingLocation}
					onClose={() => setModalParkingOpen(false)}
				/>
			)}
			<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
				{flashMessage}
			</Flash>
		</>
	);
};

TopoPreview.displayName = "TopoPreview";
