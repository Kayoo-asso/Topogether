import React, { useState } from "react";
import { UUID } from "types";
import { watchDependencies } from "helpers/quarky";
import { Image } from "components/atoms/Image";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { TracksList } from "./TracksList";
import { useSession } from "helpers/services";
import { GradeScale } from "components/molecules/GradeScale";
import { ImageSlider } from "components/molecules/ImageSlider";
import { LikeButton } from "components/atoms/buttons/LikeButton";
import { Show } from "components/atoms/utils";

import ManyTracks from "assets/icons/many-tracks.svg";

interface BoulderContentMobileProps {
	full: boolean,
	topoCreatorId: UUID;
}

export const BoulderContentMobile: React.FC<BoulderContentMobileProps> =
	watchDependencies((props: BoulderContentMobileProps) => {
		const session = useSession();
		const [officialTrackTab, setOfficialTrackTab] = useState(true);

		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value();

		return (
			<>
				{/* BOULDER IMAGE */}
				{props.full && (
					<div className="relative flex max-h-[40%] h-[40%] w-full overflow-hidden rounded-t-lg bg-dark">
						<ImageSlider
							images={boulder.images}
							tracks={boulder.tracks.quarks()}
						/>
					</div>
				)}

				<div className="flex h-[60%] flex-col">
					{/* BOULDER INFOS */}
					<div
						className={`grid grid-cols-8 items-center p-5 ${
							props.full ? "" : " mt-3"
						}`}
					>
						<div className="col-span-6">
							<div className="ktext-section-title">{boulder.name}</div>
							{boulder.isHighball && props.full && (
								<div className="ktext-base-little">High Ball</div>
							)}
							{boulder.dangerousDescent && props.full && (
								<div className="ktext-base-little">Descente dangereuse !</div>
							)}
							{!props.full && (
								<div className="mt-2 flex items-center">
									<GradeScale boulders={[boulder]} circleSize="little" />
								</div>
							)}
						</div>

						<div className="col-span-2 flex flex-row justify-end gap-5">
							{props.full && session && <LikeButton liked={boulder.liked} />}

							{!props.full && (
								<div className="relative h-[60px] w-full overflow-hidden rounded-sm">
									<Image
										image={boulder.images[0]}
										objectFit="contain"
										alt="Boulder"
										sizeHint="100vw"
									/>
								</div>
							)}
						</div>
					</div>

					{/* TODO : show once good pattern */}
					{/* TODO : display uniquely if there is some community track */}
					{/* TABS */}
					{props.full && (
						<div className="ktext-label my-2 flex w-full flex-row gap-8 px-5 font-bold">
							<span
								className={`${
									officialTrackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setOfficialTrackTab(true)}
							>
								officielles
							</span>
							<span
								className={`${
									!officialTrackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setOfficialTrackTab(false)}
							>
								communautés
							</span>
							{/* TODO */}
							{/* <span className="flex w-full justify-end">
								<button
									onClick={() => console.log("create community track")}
								>
									<AddIcon className="h-5 w-5 stroke-main" />
								</button>
							</span> */}
						</div>
					)}

					{/* TRACKSLIST */}
					<Show when={() => props.full}>
						<div className="overflow-auto pb-[30px]">
							<TracksList
								official={officialTrackTab}
								topoCreatorId={props.topoCreatorId}
							/>
						</div>
					</Show>
				</div>
			</>
		);
	}
		
);

	BoulderContentMobile.displayName = "BoulderContentMobile";
