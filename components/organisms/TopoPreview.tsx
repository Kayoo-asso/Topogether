import React, { useState } from "react";
import {
	Button,
	GradeHistogram,
	ParkingButton,
} from "components";
import { BaseColor, LightTopo, TopoStatus } from "types";
import { formatDate } from "helpers/utils";
import { Image } from "components/atoms/Image";
import Link from "next/link";
import { TopoTypeToColor } from "helpers/topo";
import { ModalBG, ParkingModal, SlideoverRightDesktop } from "components/atoms/overlays";
import { TopoPreviewBoutons } from "./TopoPreviewBoutons";

import Rock from "assets/icons/rock.svg";
import ManyTracks from "assets/icons/many-tracks.svg";
import Topo from "assets/icons/topo.svg";

type TopoPreviewButton = {
	content: string;
	link?: string;
	onClick?: () => void;
	color?: BaseColor | "red";
};

interface TopoPreviewProps {
	topo: LightTopo;
	displayLikeDownload?: boolean;
	displayCreator?: boolean;
	displayLastDate?: boolean;
	displayParking?: boolean;
	mainButton?: TopoPreviewButton;
	secondButton?: TopoPreviewButton;
	thirdButton?: TopoPreviewButton;
	fourthButton?: TopoPreviewButton;
	open?: boolean;
	onClose: () => void;
}

export const TopoPreview: React.FC<TopoPreviewProps> = ({
	displayLikeDownload = false,
	displayCreator = false,
	displayLastDate = false,
	displayParking = false,
	...props
}: TopoPreviewProps) => {
	const [modalParkingOpen, setModalParkingOpen] = useState(false);
	const topo = props.topo;

	const topoPreviewContent = () => (
		<div className="pb-8">

			<TopoPreviewBoutons topo={props.topo} onClose={props.onClose} />

			<div className="flex flex-col">
				<div
					className={
						"h-[200px] w-full overflow-hidden" +
						(topo.image ? " md:cursor-pointer" : "")
					}
				>
					<Image
						image={topo.image}
						objectFit="cover"
						alt="image principale du topo"
						sizeHint="70vw"
						modalable
					/>
				</div>

				<div className="flex flex-row gap-1 items-center px-4 mt-3">
					<Topo className={"h-5 w-5 fill-" + TopoTypeToColor(topo.type)} />
					<div
						className={
							"ktext-section-title ml-2" +
							(topo.name.length > 16 ? " text-base" : "")
						}
					>
						{topo.name}
					</div>
				</div>
				{topo.creator && displayCreator && (
					<div className="ktext-label px-4">
						Topo créé par{" "}
						<span className="text-main">{topo.creator.userName}</span>
					</div>
				)}
				{displayLastDate && (
					<>
						{topo.status === TopoStatus.Validated && topo.validated && (
							<div className="ktext-label px-4">
								Topo validé le{" "}
								<span className="text-main">{formatDate(topo.validated)}</span>
							</div>
						)}
						{topo.status === TopoStatus.Submitted && topo.submitted && (
							<div className="ktext-label px-4">
								Topo soumis le{" "}
								<span className="text-main">{formatDate(topo.submitted)}</span>
							</div>
						)}
						{topo.status === TopoStatus.Draft && (
							<div className="ktext-label px-4">
								Topo modifié le{" "}
								<span className="text-main">{formatDate(topo.modified)}</span>
							</div>
						)}
					</>
				)}

				{topo.closestCity && topo.closestCity !== topo.name && (
					<div className="ktext-label px-4 text-grey-medium md:text-left">
						{topo.closestCity}
					</div>
				)}

				<div className="ktext-base-little hide-after-three-lines overflow-hidden px-4 pt-2">
					{topo.description}
				</div>

				<div className="flex flex-row px-4 py-4 md:flex-col">
					<div className="flex w-1/3 flex-col gap-3 md:w-full md:flex-row md:justify-around">
						<div className="flex flex-row items-center gap-2 pt-6 md:pt-0">
							<Rock className="h-6 w-6 stroke-dark" />
							<div className="ktext-subtext ml-2 flex flex-col text-center">
								<span className="ktext-big-title font-semibold">
									{topo.nbBoulders}
								</span>{" "}
								blocs
							</div>
						</div>
						<div className="flex flex-row items-center gap-2">
							<ManyTracks className="h-6 w-6 stroke-dark" />
							<div className="ktext-subtext ml-2 flex flex-col text-center">
								<span className="ktext-big-title font-semibold">
									{topo.nbTracks}
								</span>{" "}
								voies
							</div>
						</div>
					</div>

					<div className="flex w-2/3 items-end justify-end md:mt-5 md:h-[120px] md:w-full md:justify-center">
						<GradeHistogram topo={topo} size="little" />
					</div>
				</div>

				{props.mainButton && (
					<div className="flex w-full flex-col px-4 py-4 items-center">
						<Button
							content={props.mainButton.content || "Entrer"}
							href={props.mainButton.link}
							// className="px-24"
							fullWidth
							onClick={props.mainButton.onClick}
						/>
					</div>
				)}

				<div className={`${displayParking && topo.parkingLocation ? '' : 'hidden'} py-4`}>
					<ParkingButton onClick={() => setModalParkingOpen(true)} />
				</div>

				{props.secondButton && (
					<div className="flex w-full flex-row justify-between px-8 pt-4 pb-8 md:pb-2">
						<div
							className={
								"ktext-label md:cursor-pointer " +
								(props.secondButton.color === "main"
									? "text-main"
									: props.secondButton.color === "second"
									? "text-second"
									: props.secondButton.color === "third"
									? "text-third"
									: props.secondButton.color === "red"
									? "text-error"
									: "text-dark")
							}
						>
							{props.secondButton.link ? (
								<Link href={props.secondButton.link}>
									<a>{props.secondButton.content}</a>
								</Link>
							) : (
								<button
									className="ktext-label"
									onClick={props.secondButton.onClick}
								>
									{props.secondButton.content}
								</button>
							)}
						</div>

						{props.thirdButton && (
							<div
								className={
									"ktext-label md:cursor-pointer " +
									(props.thirdButton.color === "main"
										? "text-main"
										: props.thirdButton.color === "second"
										? "text-second"
										: props.thirdButton.color === "third"
										? "text-third"
										: props.thirdButton.color === "red"
										? "text-error"
										: "text-dark")
								}
							>
								{props.thirdButton.link ? (
									<Link href={props.thirdButton.link}>
										<a>{props.thirdButton.content}</a>
									</Link>
								) : (
									<button
										className="ktext-label"
										onClick={props.thirdButton.onClick}
									>
										{props.thirdButton.content}
									</button>
								)}
							</div>
						)}

						{props.fourthButton && (
							<div
								className={
									"ktext-label md:cursor-pointer " +
									(props.fourthButton.color === "main"
										? "text-main"
										: props.fourthButton.color === "second"
										? "text-second"
										: props.fourthButton.color === "third"
										? "text-third"
										: props.fourthButton.color === "red"
										? "text-error"
										: "text-dark")
								}
							>
								{props.fourthButton.link ? (
									<Link href={props.fourthButton.link}>
										<a>{props.fourthButton.content}</a>
									</Link>
								) : (
									<button
										className="ktext-label"
										onClick={props.fourthButton.onClick}
									>
										{props.fourthButton.content}
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);

	return (
		<>
			<div className="md:hidden">
				<ModalBG onBgClick={props.onClose}>{topoPreviewContent()}</ModalBG>
			</div>
			<div className="hidden md:block">
				<SlideoverRightDesktop
					open
					item={props.topo}
					onClose={props.onClose}
				>
					{topoPreviewContent()}
				</SlideoverRightDesktop>
			</div>

			{topo.parkingLocation && (
				<ParkingModal
					open={modalParkingOpen}
					parkingLocation={topo.parkingLocation}
					onClose={() => setModalParkingOpen(false)}
				/>
			)}
		</>
	);
};

TopoPreview.displayName = "TopoPreview";
