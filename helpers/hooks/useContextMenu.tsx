import { useEffect } from "react";

export function useContextMenu(
	close?: () => void,
	container?: HTMLElement | null
) {
	useEffect(() => {
		const onMouseDown = (e: MouseEvent) => {
			close && close();
		};
		const onTouch = (e: TouchEvent) => {
			close && close();
		};
		const onContextMenu = (e: MouseEvent) => {
			close && close();
			if (process.env.NODE_ENV === "production") e.preventDefault();
		};
		document.addEventListener("mousedown", onMouseDown, { capture: false });
		document.addEventListener("contextmenu", onContextMenu, { capture: true });
		document.addEventListener("touchstart", onTouch, { capture: true });

		return () => {
			document.removeEventListener("mousedown", onMouseDown, { capture: false });
			document.removeEventListener("contextmenu", onContextMenu, {
				capture: true,
			});
			document.removeEventListener("touchstart", onTouch, { capture: true });
		};
	}, [container, close]);
}
