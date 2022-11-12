import React from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, Grade, Track } from "types";
import ArrowSimple from "assets/icons/arrow-simple.svg";
import CrossDelete from "assets/icons/clear.svg";

interface BoulderItemLeftbarProps {
	boulder: Quark<Boulder>;
	orderIndex: number;
	selected: boolean;
	displayed: boolean;
	onArrowClick: () => void;
	onNameClick?: () => void;
	onDeleteClick?: () => void;
	onTrackClick: (trackQuark: Quark<Track>) => void;
	displayCreateTrack: boolean;
	onCreateTrack?: () => void;
}

export const BoulderItemLeftbar: React.FC<BoulderItemLeftbarProps> =
	watchDependencies((props: BoulderItemLeftbarProps) => {
		const boulder = props.boulder();
		const tracksIter = boulder.tracks.quarks();
		const trackQuarks = Array.from(tracksIter);

		const getGradeColorClass = (grade: Grade) => {
			const lightGrade = parseInt(grade[0]);
			switch (lightGrade) {
				case 3:
					return "text-grade-3";
				case 4:
					return "text-grade-4";
				case 5:
					return "text-grade-5";
				case 6:
					return "text-grade-6";
				case 7:
					return "text-grade-7";
				case 8:
					return "text-grade-8";
				case 9:
					return "text-grade-9";
			}
		};

		return (
			<>
				<div className="flex cursor-pointer flex-row items-center text-dark">
					<div className="pr-3">
						<ArrowSimple
							className={
								"h-3 w-3 cursor-pointer stroke-dark " +
								(props.selected ? "stroke-2 " : "") +
								(props.displayed ? "-rotate-90" : "rotate-180")
							}
							onClick={props.onArrowClick}
						/>
					</div>
					<div onClick={props.onNameClick} className="flex-1">
						<span className={"mr-2" + (props.selected ? " font-semibold" : "")}>
							{props.orderIndex}.
						</span>
						<span
							className={
								(boulder.name.length > 12
									? "ktext-base-little"
									: "ktext-base") + (props.selected ? " font-semibold" : "")
							}
						>
							{boulder.name}
						</span>
					</div>
					{props.onDeleteClick &&
						<div className="cursor-pointer" onClick={props.onDeleteClick}>
							<CrossDelete
								className={"h-4 w-4 stroke-grey-medium hover:stroke-dark"}
							/>
						</div>
					}
				</div>

				{props.displayed && (
					// TRACKS
					<div className="ml-4 mb-4 flex flex-col">
						{trackQuarks.map((trackQuark) => {
							const track = trackQuark();
							return (
								<div
									key={track.id}
									className="flex cursor-pointer flex-row items-baseline"
									onClick={() => props.onTrackClick(trackQuark)}
								>
									{track.grade && (
										<div
											className={
												"ktext-subtitle mr-2 " + getGradeColorClass(track.grade)
											}
										>
											{track.grade}
										</div>
									)}
									<div
										className={
											(track.name && track.name.length > 16
												? "ktext-base-little"
												: "ktext-base") + "text-grey-medium"
										}
									>
										{track.name}
									</div>
								</div>
							);
						})}
						{props.displayCreateTrack && (
							<div
								className="mt-2 cursor-pointer text-grey-medium"
								onClick={props.onCreateTrack}
							>
								+ Nouvelle voie
							</div>
						)}
					</div>
				)}
			</>
		);
	});

BoulderItemLeftbar.displayName = "Boulder Item Leftbar";
