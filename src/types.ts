import { getLightTopos } from "./server/queries";

export type SetState<T> = (update: T | ((prev: T) => T)) => void;

export type LightTopo = Awaited<ReturnType<typeof getLightTopos>>[number];
export type Grade = LightTopo["allGrades"][number];