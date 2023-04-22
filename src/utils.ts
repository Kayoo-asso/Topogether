import { LightTopo } from "./server/queries";

export function classNames(
	...classes: Array<string | undefined | null | false>
) {
	return classes.filter(Boolean).join(" ");
}

// Just a utility function for nice TypeScript checks for `gradeCategory` below
type Grade = LightTopo["allGrades"][number];
type FirstLetter<T extends string> = T extends `${infer F}${infer _}` ? F : T;
export function gradeCategory<G extends Grade>(grade: G): G extends string ? FirstLetter<G> : "P" {
  return grade ? grade[0] : "P" as any;
}

export function buildGradeHistogram(lightTopo: LightTopo) {
	const histogram = {
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		P: 0,
	};
	for (const grade of lightTopo.allGrades) {
		// Tracks without a grade go into the `P` (Project) category
		histogram[gradeCategory(grade)] += 1;
	}
	return histogram;
}
