import React, { useState } from "react";
import {
	DownloadButton,
	Flash,
	GradeHistogram,
	LikeButton,
	SlideoverLeftDesktop,
	SlideoverMobile,
} from "components";
import { Signal } from "helpers/quarky";
import { Amenities, Topo } from "types";
import { listRockTypes, hasFlag } from "helpers/bitflags";
import { useBreakpoint } from "helpers/hooks";
import { TopoTypeToColor } from "helpers/topo";

import WaypointIcon from "assets/icons/waypoint.svg";
import Rock from "assets/icons/rock.svg";
import ManyTracks from "assets/icons/many-tracks.svg";
import Toilets from "assets/icons/toilets.svg";
import Picnic from "assets/icons/picnic.svg";
import WaterDrop from "assets/icons/water-drop.svg";
import Bin from "assets/icons/bin.svg";
import Umbrella from "assets/icons/umbrella.svg";

interface InfoSlideoverProps {
	topo: Signal<Topo>;
	open?: boolean;
	className?: string;
	onClose?: () => void;
}

export const InfoSlideover: React.FC<InfoSlideoverProps> = ({
	open = true,
	...props
}: InfoSlideoverProps) => {
	const breakpoint = useBreakpoint();
	const [flashMessage, setFlashMessage] = useState<string>();
	const topo = props.topo();

	let nbOfBoulders = 0;
	let nbOfTracks = 0;

	for (const sector of topo.sectors) {
		nbOfBoulders += sector.boulders.length;
		for (const boulder of topo.boulders) {
			nbOfTracks += boulder.tracks.length;
		}
	}

	const infosContent = () => (
		<div className="flex h-full flex-col pt-10 md:pt-0">
			<div className="absolute left-1 top-1 z-100 flex flex-row gap-6 px-6 pt-4 md:left-2 md:top-2">
				<LikeButton liked={topo.liked} />
				<DownloadButton topo={topo} />
			</div>

			<div className="flex flex-col items-center px-6 pt-5 md:items-start md:px-0 md:pt-0">
				{topo.creator?.userName && (
					<div className="ktext-label text-center md:hidden">
						Topo créé par{" "}
						<span className="cursor-pointer text-main">
							{topo.creator.userName}
						</span>
					</div>
				)}

				{topo.forbidden && (
					<div className="ktext-section-title w-full text-center text-error">
						Site interdit !
					</div>
				)}

				<div className="ktext-big-title mt-4 flex flex-row items-center text-center">
					<div className="mr-2 hidden md:inline">
						<WaypointIcon className={"h-6 w-6 " + TopoTypeToColor(topo.type)} />
					</div>
					{topo.name}
				</div>

				<div className="ktext-label mt-1 flex w-full flex-col text-center">
					<div className="text-grey-medium">
						{topo.closestCity !== topo.name ? topo.closestCity : ""}
					</div>
					<div className="flex w-full flex-row justify-center md:justify-between">
						<div
							className="cursor-pointer text-grey-medium"
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
							{parseFloat(topo.location[1].toFixed(12)) +
								"," +
								parseFloat(topo.location[0].toFixed(12))}
						</div>
						{topo.creator?.userName && (
							<div className="hidden md:block">
								Topo créé par{" "}
								<span className="cursor-pointer text-main">
									{topo.creator.userName}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-6 overflow-auto px-6 pb-8 md:px-0">
				<div className="flex min-h-[150px] flex-row items-end justify-between md:justify-evenly">
					<div className="flex flex-col items-center">
						{nbOfBoulders}
						<Rock className="h-8 w-8 stroke-dark" />
					</div>
					<div className="flex flex-col items-center pr-8">
						{nbOfTracks}
						<ManyTracks className="h-8 w-8 stroke-dark" />
					</div>
					<div className="h-full">
						<GradeHistogram topo={topo} />
					</div>
				</div>

				<div className="ktext-base-little">
					{topo.description}
				</div>

				<div className="flex flex-col gap-1">
					{topo.rockTypes && (
						<div>
							<span className="font-semibold">Roche : </span>
							{listRockTypes(topo.rockTypes).join(", ")}
						</div>
					)}
					{topo.altitude && (
						<div>
							<span className="font-semibold">
								Altitude au pieds des voies :{" "}
							</span>
							{topo.altitude}m
						</div>
					)}
					{hasFlag(topo.amenities, Amenities.AdaptedToChildren) && (
						<div className="font-semibold">Adapté aux enfants</div>
					)}
					{topo.danger && (
						<div>
							<div className="font-semibold">Site dangereux !</div>
							{topo.danger}
						</div>
					)}
					<div>
						<div className="font-semibold">Equipements présents : </div>
						<div className="mt-2 flex flex-row gap-6">
							{hasFlag(topo.amenities, Amenities.Toilets) && (
								<Toilets className="h-5 w-5 fill-main" />
							)}
							{hasFlag(topo.amenities, Amenities.PicnicArea) && (
								<Picnic className="h-6 w-6 stroke-main" />
							)}
							{hasFlag(topo.amenities, Amenities.Waterspot) && (
								<WaterDrop className="h-5 w-5 stroke-main" />
							)}
							{hasFlag(topo.amenities, Amenities.Bins) && (
								<Bin className="h-5 w-5  fill-main stroke-main" />
							)}
							{hasFlag(topo.amenities, Amenities.Shelter) && (
								<Umbrella name="umbrella" className="h-5 w-5 fill-main" />
							)}
						</div>
					</div>
					{topo.otherAmenities && <div>{topo.otherAmenities}</div>}
				</div>
			</div>
		</div>
	);

	return (
		<>
			{breakpoint === "mobile" && (
				<SlideoverMobile onClose={props.onClose}>
					{infosContent()}
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideoverLeftDesktop
					open={open}
					onClose={props.onClose}
					className={props.className}
				>
					{infosContent()}
				</SlideoverLeftDesktop>
			)}

			<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
				{flashMessage}
			</Flash>
		</>
	);
};
