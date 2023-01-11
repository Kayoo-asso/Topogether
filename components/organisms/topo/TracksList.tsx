import React, { useCallback, useMemo } from "react";
import { AverageNote, GradeCircle } from "components";
import { gradeToLightGrade, UUID } from "types";
import { watchDependencies } from "helpers/quarky";
import { listFlags } from "helpers/bitflags";
import { OrientationName, ReceptionName } from "types/EnumNames";
import { useBreakpoint } from "helpers/hooks";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { TrackSpecName } from "types/BitflagNames";

const gradeColors = {
	3: "text-grade-3",
	4: "text-grade-4",
	5: "text-grade-5",
	6: "text-grade-6",
	7: "text-grade-7",
	8: "text-grade-8",
	9: "text-grade-9",
	P: "border-grey-light bg-grey-light text-white",
};

interface TracksListProps {
	official: boolean,
	topoCreatorId : UUID,
}

export const TracksList: React.FC<TracksListProps> = watchDependencies((props: TracksListProps) => {
		const breakpoint = useBreakpoint();

		const select = useSelectStore(s => s.select);
		const flushTrack = useSelectStore(s => s.flush.track);
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const selectedTrack = selectedBoulder.selectedTrack;

		const boulder = selectedBoulder.value()
		const tracks = useMemo(() => boulder.tracks
			.quarks()
			.filter(
				(track) =>
					(track().creatorId === props.topoCreatorId) === props.official
			)
			.toArray()
			.sort((t1, t2) => t1().index - t2().index),
		[boulder.tracks, props.topoCreatorId, props.official]);

		const toggleSelectedTrack = useCallback(
			(trackQuark) => {
				const track = trackQuark();
				if (selectedTrack && selectedTrack().id === track.id) flushTrack();
				else select.track(trackQuark, selectedBoulder.value);
			},
			[selectedTrack, boulder, select, flushTrack]
		);

		return (
			<div className="h-full w-full border-t border-grey-light">
				{tracks
					.map((trackQuark) => {
						const track = trackQuark();
						const grade = gradeToLightGrade(track.grade);
						return (
							<div
								key={track.id}
								className={
									"flex md:cursor-pointer flex-col border-b border-grey-light px-5 py-5 md:py-3 md:hover:bg-grey-superlight" +
									(!selectedTrack ? '' :
										selectedTrack().id !== track.id ? 
										" opacity-40" : "")
								}
								onClick={() => toggleSelectedTrack(trackQuark)}
							>
								<div className="flex w-full flex-row items-center">
									<GradeCircle
										grade={grade}
										className="md:cursor-pointer"
										content={(track.index + 1).toString()}
										onClick={() => toggleSelectedTrack(trackQuark)}
									/>

									{track.grade && (
										<div
											className={`ktext-subtitle ml-3 text-right ${gradeColors[grade]}`}
										>
											{track.grade}
										</div>
									)}
									<div className="ml-4 flex w-7/12 flex-col">
										<span className="ktext-base">{track.name}</span>
										{track.isTraverse && (
											<div className="ktext-subtext">Traversée</div>
										)}
										{track.isSittingStart && (
											<div className="ktext-subtext">Départ assis</div>
										)}
									</div>

									<AverageNote
										ratings={track.ratings}
										className="justify-end"
										wrapperClassName="col-span-2"
									/>
								</div>

								{selectedTrack && selectedTrack().id === track.id &&
									breakpoint === "mobile" && (
										<>
											{track.description && (
												<div className="mt-4">{track.description}</div>
											)}
											{(track.spec || track.orientation) && (
												<div className="mt-4 flex flex-row justify-between gap-2">
													<div className="flex w-1/3 flex-col">
														{track.spec && (
															<>
																<div className="ktext-subtitle">Spécifications</div>
																{listFlags(
																	track.spec,
																	TrackSpecName
																).join(", ")}
															</>
														)}
													</div>

													<div className="flex w-1/3 flex-col">
														{track.reception && (
															<div>
																<span className="ktext-subtitle">
																	Réception :{" "}
																</span>
																{ReceptionName[track.reception!]}
															</div>
														)}
													</div>

													<div className="flex w-1/3 flex-col">
														{track.orientation && (
															<div>
																<span className="ktext-subtitle">
																	Orientation :
																</span>
																{OrientationName[track.orientation!]}
															</div>
														)}
													</div>
												</div>
											)}
										</>
									)}
							</div>
						);
					})}
			</div>
		);
	}
);

TracksList.displayName = "TracksList";
