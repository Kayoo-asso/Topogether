import React from "react";
import { TrackRating } from "types";
import Star from "assets/icons/star.svg";

interface AverageNoteProps {
	ratings: Iterable<TrackRating>;
	className?: string;
	wrapperClassName?: string;
}

export const AverageNote: React.FC<AverageNoteProps> = (
	props: AverageNoteProps
) => {
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
				<div
					className={`flex flex-row items-end ${
						props.className ? props.className : ""
					}`}
				>
					<Star className="h-6 w-6 fill-main" />
					<span className="ktext-subtitle mb-[-4px] text-main">{avgNote}</span>
				</div>
			</div>
		);
	}
	return null;
};
