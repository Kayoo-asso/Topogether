import { useDeleteStore } from 'components/store/deleteStore';
import { useDrawerStore } from 'components/store/drawerStore';
import { useSelectStore } from 'components/store/selectStore';
import React, { useEffect, useState } from 'react';
import { MapToolEnum } from 'types';

interface KeyboardShortcutProps {}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = (props: KeyboardShortcutProps) => {
    const selectedItem = useSelectStore(s => s.item);
	const select = useSelectStore(s => s.select);
    const flush = useSelectStore(s => s.flush);
	const tool = useSelectStore(s => s.tool);

	const del = useDeleteStore(d => d.delete);

	const isDrawerOpen = useDrawerStore(d => d.isDrawerOpen);
	const drawerTool = useDrawerStore(d => d.selectedTool);
	const selectDrawerTool = useDrawerStore(d => d.selectTool);

    const [tempCurrentTool, setTempCurrentTool] = useState<MapToolEnum>();

    // Handle key shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Escape") {
				// TODO: change this, we first wish to cancel any ongoing action,
				// then set the current tool to undefined
				if (isDrawerOpen && drawerTool !== 'LINE_DRAWER') selectDrawerTool('LINE_DRAWER');
				else if (tool) flush.tool();
				else if (selectedItem.type === 'boulder' && selectedItem.selectedTrack) flush.track();
				else flush.all();
			}
			else if (e.code === 'Delete' && selectedItem) {
				if (selectedItem.type === 'boulder' && selectedItem.selectedTrack) del.item({
					type: 'track',
					value: selectedItem.selectedTrack,
					boulder: selectedItem.value,
					selectedBoulder: selectedItem
				})
				else del.item(selectedItem)
			}
			else if (e.code === "Space" && tool) {
				setTempCurrentTool(tool);
				flush.tool();
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === "Space" && tempCurrentTool) {
				select.tool(tempCurrentTool);
				setTempCurrentTool(undefined);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [tool, tempCurrentTool, selectedItem, drawerTool]);

    return null;
}