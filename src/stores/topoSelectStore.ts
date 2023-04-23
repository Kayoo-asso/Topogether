import { create } from "zustand";
import { LightTopo, UUID } from "~/types";

interface TopoSelectStore {
  selected: LightTopo | undefined;
}
export const useTopoSelectStore = create<TopoSelectStore>(() => ({
  selected: undefined
}))