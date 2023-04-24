import Link from "next/link";
import React, { useState } from "react";
import { Button } from "~/components/buttons/Button";
import { PreviewButtons } from "~/components/buttons/ItemsHeaderButtons";
import { LikeButton } from "~/components/buttons/LikeButton";
import { ParkingButton } from "~/components/buttons/ParkingButton";
import { ParkingModal } from "~/components/forms/ParkingModal";
import { Image } from "~/components/ui/Image";
import { ModalBG } from "~/components/ui/Modal";
import { SlideoverRight } from "~/components/layout/SlideoverRight";
import {
  BaseColor,
  textColors,
  topoColors,
  topoFillColors,
} from "~/helpers/colors";
import { api } from "~/server/api";
import { useTopoSelectStore } from "~/stores/topoSelectStore";
import { classNames, encodeUUID } from "~/utils";
import { GradeHistogram } from "./GradeHistogram";

import ManyTracks from "assets/icons/many-tracks.svg";
import RockLight from "assets/icons/rockLight.svg";
import Topo from "assets/icons/topo.svg";

interface TopoPreviewProps {
	open?: boolean;
	displayLikeDownload?: boolean;
	displayCreator?: boolean;
	displayLastDate?: boolean;
	displayParking?: boolean;
	sendTo: "topo" | "builder";
	otherButtons?: TopoPreviewButton[];
}

function Container(
	props: React.PropsWithChildren<{
		onClose(): void;
	}>
) {
	return (
		<>
			<div className="md:hidden">
				<ModalBG onBgClick={props.onClose}>{props.children}</ModalBG>
			</div>

			<div className="hidden md:block">
				<SlideoverRight open onClose={props.onClose}>
					{props.children}
				</SlideoverRight>
			</div>
		</>
	);
}

export function TopoPreview(props: TopoPreviewProps) {
	const [modalParkingOpen, setModalParkingOpen] = useState(false);
	const topo = useTopoSelectStore((s) => s.selected);

	const creatorQuery = api.getProfile.useQuery(topo?.creatorId!, {
		enabled: !!topo?.creatorId,
	});

	const onClose = () => useTopoSelectStore.setState({ selected: undefined });

	if (!topo) {
		return null;
	}

	return (
		<>
			<Container onClose={onClose}>
				<div className="pb-8">
					<PreviewButtons onClose={onClose}>
						{/* TODO: only display when user is logged in */}
						<LikeButton liked={false} onClick={() => {}} />
						{/* TODO: download button */}
					</PreviewButtons>

					<div className="flex flex-col">
						<div className="h-[200px] w-full overflow-hidden">
							<Image
								image={topo.image}
								objectFit="cover"
								alt="image principale du topo"
								sizeHint="70vw"
								modalable
							/>
						</div>

						<div className="mt-3 flex flex-row items-center gap-1 px-4">
							<Topo
								className={classNames("h-5 w-5", topoFillColors[topo.type])}
							/>
							<div
								className={
									"ktext-section-title ml-2" +
									(topo.name.length > 16 ? " text-base" : "")
								}
							>
								{topo.name}
							</div>
						</div>
						{props.displayCreator && creatorQuery.data && (
							<div className="ktext-label px-4">
								Topo créé par{" "}
								<span className="text-main">{creatorQuery.data.username}</span>
							</div>
						)}
						{props.displayLastDate && (
							<>
								{topo.status === "validated" && topo.validated && (
									<div className="ktext-label px-4">
										Topo validé le{" "}
										<span className="text-main">
											{topo.validated.toLocaleDateString()}
										</span>
									</div>
								)}
								{topo.status === "submitted" && topo.submitted && (
									<div className="ktext-label px-4">
										Topo soumis le{" "}
										<span className="text-main">
											{topo.submitted.toLocaleDateString()}
										</span>
									</div>
								)}
								{topo.status === "draft" && (
									<div className="ktext-label px-4">
										Topo modifié le{" "}
										<span className="text-main">
											{topo.modified.toLocaleDateString()}
										</span>
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
									<RockLight className="h-6 w-6 stroke-dark" />
									<div className="ktext-subtext ml-2 flex flex-col text-center">
										<span className="ktext-big-title font-semibold">
											{topo.nbRocks}
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
								<GradeHistogram grades={topo.allGrades} size="little" />
							</div>
						</div>

						<div className="flex w-full flex-col items-center px-4 py-4">
							<Button
								content="Entrer"
								href={`/${props.sendTo}/${encodeUUID(topo.id)}`}
								fullWidth
							/>
						</div>

						{props.displayParking && topo.parkingLocation && (
							<div className="py-4">
								<ParkingButton
									onClick={() => setModalParkingOpen(true)}
									displayIcon
								/>
							</div>
						)}

						{props.otherButtons && (
							<div className="flex w-full flex-row justify-between px-8 pb-8 pt-4 md:pb-2">
								{props.otherButtons.map((props) => (
									<SecondaryButton key={props.content} {...props} />
								))}
							</div>
						)}
					</div>
				</div>
			</Container>

			{topo.parkingLocation && (
				<ParkingModal
					open={modalParkingOpen}
					parkingLocation={topo.parkingLocation}
					onClose={() => setModalParkingOpen(false)}
				/>
			)}
		</>
	);
}

type TopoPreviewButton = {
	content: string;
	color?: BaseColor | "red" | "dark";
} & (
	| { link: string; onClick?: undefined }
	| { link?: undefined; onClick(): void }
);

function SecondaryButton({
	color = "dark",
	content,
	link,
	onClick,
}: TopoPreviewButton) {
	const className = "ktext-label " + textColors[color];
	if (link) {
		return (
			<Link className={className} href={link}>
				{content}
			</Link>
		);
	} else {
		return (
			<button className={className} onClick={onClick}>
				{content}
			</button>
		);
	}
}
