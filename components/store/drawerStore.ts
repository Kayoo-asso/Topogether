import { DrawerToolEnum } from "types";
import create from "zustand";

type DrawerStore = {
    isDrawerOpen: boolean,
    openDrawer: () => void,
    closeDrawer: () => void,
	isGradeSelectorOpen: boolean,
    openGradeSelector: () => void,
    closeGradeSelector: () => void,
	isOtherTracksDisplayed: boolean,
    toggleOtherTracks: () => void,
	selectedTool: DrawerToolEnum,
    selectTool: (t: DrawerToolEnum) => void,
}

export const useDrawerStore = create<DrawerStore>()((set, get) => ({
    isDrawerOpen: false,
    openDrawer: () => set((s) => ({ isDrawerOpen: true, selectedTool: 'LINE_DRAWER' })),
    closeDrawer: () => set((s) => ({ isDrawerOpen: false, selectedTool: 'LINE_DRAWER' })),

    isGradeSelectorOpen: false,
    openGradeSelector: () => set((s) => ({ isGradeSelectorOpen: true })),
    closeGradeSelector: () => set((s) => ({ isGradeSelectorOpen: false })),

	isOtherTracksDisplayed: false,
    toggleOtherTracks: () => set((s) => ({ isOtherTracksDisplayed: !get().isOtherTracksDisplayed })),

	selectedTool: 'LINE_DRAWER',
    selectTool: (t: DrawerToolEnum) => set((s) => ({ selectedTool: t })),
}));