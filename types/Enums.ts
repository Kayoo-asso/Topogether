// NEVER reorder the values of an enum, only add new values at the end.
// This is necessary to avoid a mismatch with existing values in the database.

export type Enum = Difficulty | Orientation | Reception;

export enum Difficulty {
	Good,
	OK,
	Bad,
	Dangerous,
}

export enum Reception {
	Good,
	OK,
	Dangerous,
	None,
}

export enum Orientation {
	N,
	NE,
	E,
	SE,
	S,
	SW,
	W,
	NW,
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export enum Seasons {
	Winter,
	Spring,
	Summer,
	Autumn,
}

export enum TopoStatus {
	Draft,
	Submitted,
	Validated,
}

export const grades = [
	"3",
	"3+",
	"4",
	"4+",
	"5a",
	"5a+",
	"5b",
	"5b+",
	"5c",
	"5c+",
	"6a",
	"6a+",
	"6b",
	"6b+",
	"6c",
	"6c+",
	"7a",
	"7a+",
	"7b",
	"7b+",
	"7c",
	"7c+",
	"8a",
	"8a+",
	"8b",
	"8b+",
	"8c",
	"8c+",
	"9a",
	"9a+",
	"9b",
	"9b+",
	"9c",
	"9c+",
	'P'
] as const;

export const lightGrades = [3, 4, 5, 6, 7, 8, 9, "P"] as const; //"P" is for Project (the default grade, when it has not been settle yet)

export type Grade = typeof grades[number];

export type LightGrade = typeof lightGrades[number];

export const gradeToLightGrade = (grade?: Grade): LightGrade => {
	if (grade) {
		return Number(grade[0]) as LightGrade;
	}
	return "P";
};

export type MapToolEnum = "ROCK" | "SECTOR" | "PARKING" | "WAYPOINT" | "DRAGMAP" | undefined;

export type DrawerToolEnum =
	| "LINE_DRAWER"
	| "HAND_DEPARTURE_DRAWER"
	| "FOOT_DEPARTURE_DRAWER"
	| "FORBIDDEN_AREA_DRAWER"
	| "ERASER";

export type PointEnum =
	| "LINE_POINT"
	| "HAND_DEPARTURE_POINT"
	| "FOOT_DEPARTURE_POINT"
	| "FORBIDDEN_AREA_POINT";

export type AreaEnum = "FORBIDDEN_AREA";
