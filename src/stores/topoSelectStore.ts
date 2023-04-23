import { create } from "zustand";
import { LightTopo } from "~/types";

interface TopoSelectStore {
  selected: LightTopo | undefined;
}
export const useTopoSelectStore = create<TopoSelectStore>(() => ({
  selected: undefined
}))