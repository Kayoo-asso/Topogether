import { TopoTypes } from "types";

export const topoColors = {
  [TopoTypes.Boulder]: "main",
  [TopoTypes.Cliff]: "third",
  [TopoTypes.DeepWater] : "grade-5",
  [TopoTypes.Artificial]: "dark",
  [TopoTypes.None]: "grey-light"
}