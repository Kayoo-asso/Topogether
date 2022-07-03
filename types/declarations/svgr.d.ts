declare type SVG = React.VFC<React.SVGProps<SVGSVGElement>>;

declare module "*.svg" {
	import React from "react";
	const SVG: SVG;
	export = SVG;
}
