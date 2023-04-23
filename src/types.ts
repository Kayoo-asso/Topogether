import { getLightTopos } from "./server/queries";

export type SetState<T> = (update: T | ((prev: T) => T)) => void;

export type LightTopo = Awaited<ReturnType<typeof getLightTopos>>[number];

export type Grade = Exclude<LightTopo["allGrades"][number], null>;
// Just a utility function for nice TypeScript checks for `gradeCategory` below
export type FirstLetter<T> = T extends `${infer F}${infer _}` ? F : null;
export type GradeCategory = FirstLetter<Grade>;

export type UUID = string & {
	readonly _isUUID: unique symbol;
};

export type GeoCoordinates = [lng: number, lat: number];