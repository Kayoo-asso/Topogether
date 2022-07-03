import React from "react";
import {
	lightGrades,
	LightTopo,
	Topo,
	GradeHistogram as GradeHistogramType,
	gradeToLightGrade,
} from "types";

interface GradeHistogramProps {
	topo: Topo | LightTopo;
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
	None: "bg-grey-light",
};

const defaultGradeHistogram = (): GradeHistogramType => ({
	3: 0,
	4: 0,
	5: 0,
	6: 0,
	7: 0,
	8: 0,
	9: 0,
	None: 0,
});

const isLight = (topo: LightTopo | Topo): topo is LightTopo =>
	(topo as LightTopo).grades !== undefined;

export const GradeHistogram: React.FC<GradeHistogramProps> = ({
	topo,
	size = "normal",
	...props
}: GradeHistogramProps) => {
	let histogram = defaultGradeHistogram();
	if (isLight(topo)) {
		histogram = {
			...histogram,
			...topo.grades,
		};
	} else {
		for (const boulder of topo.boulders) {
			for (const track of boulder.tracks) {
				const lg = gradeToLightGrade(track.grade);
				histogram[lg] += 1;
			}
		}
	}
	const total =
		histogram[3] +
		histogram[4] +
		histogram[5] +
		histogram[6] +
		histogram[7] +
		histogram[8] +
		histogram[9] +
		histogram["None"];
	const { None, ...grades } = histogram;
	const maxNbOfTracks = Math.max(...Object.values(grades));
	const ratio = total / maxNbOfTracks;

	return (
		<div className="flex h-full">
			{lightGrades.slice(0, -1).map((grade) => {
				const count = histogram[grade];
				const heightPercent = (count / total) * 100 * ratio;
				const height = `${heightPercent}%`;

				return (
					<div className="flex flex-col justify-end h-full mr-1" key={grade}>
						<div
							className={`text-center ${
								size === "normal" ? "ktext-base" : "ktext-base-little"
							}`}
						>
							{count}
						</div>
						<div
							style={{ height, minHeight: "22px" }}
							className={`ktext-subtitle ${
								size === "normal" ? "w-6" : "w-[22px]"
							} flex flex-col justify-end items-center rounded-full text-white ${
								bgStyles[grade]
							}`}
						>
							<div>{grade}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
