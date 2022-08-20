export function hexWithAlpha(hex: string, opacity: number) {
	opacity = (255 * opacity) | 0;
	return hex + opacity.toString(16);
}
