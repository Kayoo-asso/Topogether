import { TopoTypes } from "types";

export const topoColors = {
  [TopoTypes.Boulder]: "main",
  [TopoTypes.Cliff]: "third",
  [TopoTypes.DeepWater] : "grade-5",
  [TopoTypes.Artificial]: "dark",
  [TopoTypes.None]: "grey-light"
}

export const topoFillColors = {
  [TopoTypes.Boulder]: "fill-main",
  [TopoTypes.Cliff]: "fill-third",
  [TopoTypes.DeepWater] : "fill-grade-5",
  [TopoTypes.Artificial]: "fill-dark",
  [TopoTypes.None]: "fill-grey-light"
}

export const textColors = {
  main: "text-main",
  second: "text-second",
  third: "text-third",
  red: "text-error",
  dark: "text-dark"
}

export type BaseColor = "main" | "second" | "third";
export type StructureColor =
	| "dark"
	| "grey-medium"
	| "grey-light"
	| "grey-superlight"
	| "error";
export type GradeColor =
	| "grade-3"
	| "grade-2"
	| "grade-3"
	| "grade-4"
	| "grade-5"
	| "grade-6"
	| "grade-7";
export type Color = BaseColor | StructureColor | GradeColor;
