import React from "react";
import { TrackRating } from "types";
import Star from "assets/icons/star.svg";

interface AverageNoteProps {
	ratings: Iterable<TrackRating>;
	className?: string;
	wrapperClassName?: string;
}

export const AverageNote: React.FC<AverageNoteProps> = (props: AverageNoteProps) => {
	const ratings = props.ratings;

	let total = 0;
	let length = 0;
	for (const rating of ratings) {
		total += rating.rating;
		length += 1;
	}
	const avgNote = total / length;

	if (length >= 1) {
		return (
			<div className={props.wrapperClassName ? props.wrapperClassName : ""}>
				<div className={`flex flex-row items-end ${props.className ? props.className : ""}`}>
					<Star className="fill-main w-6 h-6" />
					<span className="ktext-subtitle text-main mb-[-4px]">{avgNote}</span>
				</div>
			</div>
		);
	}
	return null;
};
