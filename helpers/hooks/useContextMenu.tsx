import { useEffect } from "react";

export function useContextMenu(close: () => void, container?: HTMLElement | null) {
	useEffect(() => {
		const onScroll = (e: Event) => e.preventDefault();
		const onMouseDown = (e: MouseEvent) => {
			close();
			container?.removeEventListener("wheel", onScroll);
		};
		const onTouch = (e: TouchEvent) => {
			close();
		};
		const onContextMenu = (e: MouseEvent) => {
			close();
			container?.addEventListener("wheel", onScroll);
			if (process.env.NODE_ENV === "production") e.preventDefault();
		};
		document.addEventListener("mousedown", onMouseDown, { capture: false });
		document.addEventListener("contextmenu", onContextMenu, { capture: true });
		document.addEventListener("touchstart", onTouch, { capture: true });

		return () => {
			document.removeEventListener("mousedown", onMouseDown, { capture: true });
			document.removeEventListener("contextmenu", onContextMenu, {
				capture: true,
			});
			document.removeEventListener("touchstart", onTouch, { capture: true });
		};
	}, [container, close]);
}
