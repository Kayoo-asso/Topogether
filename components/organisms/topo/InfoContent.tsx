import React, { useState } from "react";
import {
	DownloadButton,
	GradeHistogram,
	LikeButton,
} from "components";
import { Signal } from "helpers/quarky";
import { Amenities, Topo } from "types";
import { hasFlag, listFlags } from "helpers/bitflags";
import { TopoTypeToColor } from "helpers/topo";

import Marker from "assets/icons/marker.svg";
import Rock from "assets/icons/rock.svg";
import ManyTracks from "assets/icons/many-tracks.svg";
import Toilets from "assets/icons/toilets.svg";
import Picnic from "assets/icons/picnic.svg";
import WaterDrop from "assets/icons/water-drop.svg";
import Bin from "assets/icons/bin.svg";
import Umbrella from "assets/icons/umbrella.svg";
import { Flash } from "components/atoms/overlays";
import { RockNames } from "types/BitflagNames";
import { useSession } from "helpers/services";

interface InfoContentProps {
	topo: Signal<Topo>;
}

export const InfoContent: React.FC<InfoContentProps> = (props: InfoContentProps) => {
	const [flashMessage, setFlashMessage] = useState<string>();
	const topo = props.topo();
	const session = useSession();

	const nbOfBoulders = topo.boulders.length;
	let nbOfTracks = 0;
	for (const boulder of topo.boulders) {
		nbOfTracks += boulder.tracks.length;
	}

	return (
		<>
			<div className="flex h-full flex-col">
				<div className="absolute z-100 flex flex-row gap-6 px-6 pt-4 left-1 top-1 md:left-48 md:top-3">
					{session &&
						<>
							<LikeButton liked={topo.liked} />
							<DownloadButton topo={topo} />
						</>
					}
				</div>

				<div className="flex flex-col items-center px-6 pt-5 md:items-start md:px-0 md:pt-0">
					{topo.creator?.userName && (
						<div className="ktext-label text-center md:hidden">
							Topo créé par{" "}
							<span className="md:cursor-pointer text-main">
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
							<Marker className={"h-6 w-6 fill-" + TopoTypeToColor(topo.type)} />
						</div>
						{topo.name}
					</div>

					<div className="ktext-label mt-1 flex w-full flex-col text-center">
						<div className="text-grey-medium">
							{topo.closestCity !== topo.name ? topo.closestCity : ""}
						</div>
						<div className="flex w-full flex-row justify-center md:justify-between">
							<div
								className="md:cursor-pointer text-grey-medium"
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
									<span className="md:cursor-pointer text-main">
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
								{listFlags(topo.rockTypes, RockNames).join(", ")}
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
						{(hasFlag(topo.amenities, Amenities.Toilets) || hasFlag(topo.amenities, Amenities.PicnicArea) || hasFlag(topo.amenities, Amenities.Waterspot) || hasFlag(topo.amenities, Amenities.Bins) || hasFlag(topo.amenities, Amenities.Shelter) || topo.otherAmenities) &&
							<>
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
								<>{topo.otherAmenities && <div>{topo.otherAmenities}</div>}</>
							</>
						}
					</div>
				</div>
			</div>

			<Flash open={!!flashMessage} onClose={() => setFlashMessage(undefined)}>
				{flashMessage}
			</Flash>
		</>
	);
};

InfoContent.displayName = 'InfoContent';