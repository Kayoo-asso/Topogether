import React from "react";
import { GradeCircle } from "components";
import {
	Boulder,
	GradeHistogram,
	gradeToLightGrade,
	LightGrade,
	lightGrades,
} from "types";

type GradeScaleProps = {
	boulder: Boulder;
	selection?: GradeHistogramSelection;
	circleSize?: "little" | "normal";
	className?: string;
	onCircleClick?: (grade: LightGrade) => void;
};

type GradeHistogramSelection = {
	[K in LightGrade]: boolean;
};

const defaultHistogramSelection: GradeHistogramSelection = {
	3: false,
	4: false,
	5: false,
	6: false,
	7: false,
	8: false,
	9: false,
	None: false,
};

const defaultGradeHistogram = (): GradeHistogram => ({
	3: 0,
	4: 0,
	5: 0,
	6: 0,
	7: 0,
	8: 0,
	9: 0,
	None: 0,
});

export const GradeScale: React.FC<GradeScaleProps> = ({
	boulder,
	selection = defaultHistogramSelection,
	circleSize = "normal",
	...props
}: GradeScaleProps) => {
	const histogram = defaultGradeHistogram();
	for (const track of boulder.tracks) {
		const lg = gradeToLightGrade(track.grade);
		histogram[lg] += 1;
	}

	return (
		<div className={`flex ${props.className}`}>
			{lightGrades.map((grade) => {
				if (grade !== "None")
					return (
						<GradeCircle
							key={grade}
							grade={grade}
							size={circleSize}
							selected={!!histogram[grade]}
							className="mr-1"
							onClick={props.onCircleClick}
						/>
					);
			})}
		</div>
	);
};
