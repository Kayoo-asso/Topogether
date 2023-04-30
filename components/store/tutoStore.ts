import create from "zustand";

type TutoType = 'SECTOR_CREATION' | "NONE"
type TutoStore = {
    value: TutoType,
    showTuto: (tuto: TutoType) => void,
    hideTuto: () => void,
}

export const useTutoStore = create<TutoStore>()((set, get) => ({
    value: "NONE",
    showTuto: (tuto) => set(t => ({ value: tuto })),
    hideTuto: () => set(t => ({ value: "NONE" })),
}));