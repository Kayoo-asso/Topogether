import { DrawerToolEnum, Track } from "types";
import create from "zustand";

type DrawerStore = {
    track?: Track,
    open: (t: Track) => void,
    close: () => void,
	isGradeSelectorOpen: boolean,
    openGradeSelector: () => void,
    closeGradeSelector: () => void,
	isOtherTracksDisplayed: boolean,
    showOtherTracks: () => void,
    hideOtherTracks: () => void,
	selectedTool: DrawerToolEnum,
    selectTool: (t: DrawerToolEnum) => void,
}

export const useDrawerStore = create<DrawerStore>()((set, get) => ({
    track: undefined,
    open: (t: Track) => set((s) => ({ track: t })),
    close: () => set((s) => ({ track: undefined })),

    isGradeSelectorOpen: false,
    openGradeSelector: () => set((s) => ({ isGradeSelectorOpen: true })),
    closeGradeSelector: () => set((s) => ({ isGradeSelectorOpen: false })),

	isOtherTracksDisplayed: false,
    showOtherTracks: () => set((s) => ({ isOtherTracksDisplayed: true })),
    hideOtherTracks: () => set((s) => ({ isOtherTracksDisplayed: false })),

	selectedTool: 'LINE_DRAWER',
    selectTool: (t: DrawerToolEnum) => set((s) => ({ selectedTool: t })),
}));