import { InteractItem, useSelectStore } from 'components/pages/selectStore';
import { isOnMap } from 'helpers/map';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MapToolEnum } from 'types';

interface KeyboardShortcutProps {
    currentTool?: MapToolEnum,
    setCurrentTool: Dispatch<SetStateAction<MapToolEnum | undefined>>
    onDelete: (item: InteractItem) => void
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = (props: KeyboardShortcutProps) => {
    const selectedItem = useSelectStore(s => s.item);
    const flush = useSelectStore(s => s.flush);

    const [tempCurrentTool, setTempCurrentTool] = useState<MapToolEnum>();

    // Handle key shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Escape") {
				// TODO: change this, we first wish to cancel any ongoing action,
				// then set the current tool to undefined
				if (props.currentTool) props.setCurrentTool(undefined);
				else flush.all();
			}
			else if (e.code === 'Delete' && isOnMap(e)) props.onDelete(selectedItem)
			else if (e.code === "Space" && props.currentTool) {
				setTempCurrentTool(props.currentTool);
				props.setCurrentTool(undefined);
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === "Space" && tempCurrentTool) {
				props.setCurrentTool(tempCurrentTool);
				setTempCurrentTool(undefined);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [props.currentTool, tempCurrentTool, selectedItem]);

    return null;
}