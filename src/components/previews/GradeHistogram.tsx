import React from "react";
import { Grade } from "~/types";
import { buildGradeHistogram, classNames } from "~/utils";

interface GradeHistogramProps {
	grades: Array<Grade>;
	size?: "little" | "normal" | "big";
}

const bgStyles = {
	3: "bg-grade-3",
	4: "bg-grade-4",
	5: "bg-grade-5",
	6: "bg-grade-6",
	7: "bg-grade-7",
	8: "bg-grade-8",
	9: "bg-grade-9",
	P: "bg-grey-light",
};

export function GradeHistogram({
	grades,
	size = "normal",
}: GradeHistogramProps) {
	const histogram = buildGradeHistogram(grades);
	const histogramKeys = Object.keys(histogram) as Array<keyof typeof histogram>;
	const total =
		histogram[3] +
		histogram[4] +
		histogram[5] +
		histogram[6] +
		histogram[7] +
		histogram[8] +
		histogram[9] +
		histogram["P"];
	const maxCount = Math.max(
		histogram[3],
		histogram[4],
		histogram[5],
		histogram[6],
		histogram[7],
		histogram[8],
		histogram[9]
	);

	return (
		<div className="flex h-full">
			{histogramKeys.map((grade) => {
				// If there are no "project" tracks, don't show this category
				if (grade === "P" && histogram["P"] === 0) {
					return;
				}
				const count = histogram[grade];
				let heightPercent = 0;
				if (maxCount > 0) {
					heightPercent = (count / maxCount) * 100;
				}
				const height = `${heightPercent}%`;

				return (
					<div className="mr-1 flex h-full flex-col justify-end" key={grade}>
						<div
							className={classNames(
								"text-center",
								size === "normal" ? "ktext-base" : "ktext-base-little"
							)}
						>
							{count}
						</div>
						<div
							style={{ height, minHeight: "22px" }}
							className={classNames(
								"ktext-subtitle flex flex-col items-center justify-end rounded-full text-white",
								size === "normal" ? "w-6" : "w-[22px]",
								bgStyles[grade]
							)}
						>
							<div>{grade}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

GradeHistogram.displayName = "GradeHistogram";
