import React from "react";
import { AverageNote, GradeCircle } from "components";
import { gradeToLightGrade, Track } from "types";
import { Quark, SelectQuarkNullable, watchDependencies } from "helpers/quarky";
import { ClimbTechniquesName, listFlags } from "helpers/bitflags";
import { OrientationName, ReceptionName } from "types/EnumNames";
import { useBreakpoint } from "helpers/hooks";

interface TracksListProps {
	tracks: Iterable<Quark<Track>>;
	selectedTrack: SelectQuarkNullable<Track>;
	onTrackClick: (trackQuark: Quark<Track>) => void;
}

const gradeColors = {
	3: "text-grade-3",
	4: "text-grade-4",
	5: "text-grade-5",
	6: "text-grade-6",
	7: "text-grade-7",
	8: "text-grade-8",
	9: "text-grade-9",
	None: "border-grey-light bg-grey-light text-white",
};

export const TracksList: React.FC<TracksListProps> = watchDependencies(
	(props: TracksListProps) => {
		const breakpoint = useBreakpoint();
		const tracks = Array.from(props.tracks);

		return (
			<div className="h-full w-full border-t border-grey-light">
				{tracks
					.sort((t1, t2) => t1().index - t2().index)
					.map((trackQuark) => {
						const track = trackQuark();
						const grade = gradeToLightGrade(track.grade);
						return (
							<div
								key={track.id}
								className={
									"flex cursor-pointer flex-col border-b border-grey-light px-5 py-5 md:py-3 md:hover:bg-grey-superlight" +
									(props.selectedTrack()
										? props.selectedTrack()!.id !== track.id
											? " opacity-40"
											: ""
										: "")
								}
								onClick={() => props.onTrackClick(trackQuark)}
							>
								<div className="flex w-full flex-row items-center">
									<GradeCircle
										grade={grade}
										className="cursor-pointer"
										content={(track.index + 1).toString()}
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

								{props.selectedTrack()?.id === track.id &&
									breakpoint === "mobile" && (
										<>
											{track.description && (
												<div className="mt-4">{track.description}</div>
											)}
											{(track.techniques ||
												track.reception ||
												track.orientation) && (
												<div className="mt-4 flex flex-row justify-between gap-2">
													<div className="flex w-1/3 flex-col">
														{track.techniques && (
															<>
																<div className="ktext-subtitle">Techniques</div>
																{listFlags(
																	track.techniques!,
																	ClimbTechniquesName
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
