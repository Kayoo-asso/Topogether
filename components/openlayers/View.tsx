import ViewObject, { ViewOptions } from "ol/View";
import { createContext, useContext, useEffect, useState } from "react";

interface ViewProps extends React.PropsWithChildren<ViewOptions> {}

const defaults = {
	constrainRotation: true,
	enableRotation: true,
	constrainOnlyCenter: false,
	smoothExtentConstraint: false,
	maxZoom: 28,
	minZoom: 0,
	multiWorld: false,
	constrainResolution: false,
	smoothResolutionConstraint: true,
	showFullExtent: false,
	projection: "EPSG:3857",
	rotation: 0,
	zoomFactor: 2,
	padding: [0, 0, 0, 0],
};

const ViewContext = createContext<ViewObject | null>(null);

export function useView(): ViewObject {
	const view = useContext(ViewContext);
	if (!view) {
		throw new Error("useView should only be used inside a <View> component");
	}
	return view;
}

export function View({ children, ...options }: ViewProps) {
	const [view, setView] = useState<ViewObject>();

	const o = { ...defaults, ...options };

	useEffect(() => {
		const v = new ViewObject(options);
		setView(v);
		return () => v.dispose();
	}, []);

	useEffect(() => {
		view?.setCenter(o.center);
	}, [view, o.center]);

	useEffect(() => {
		view?.setConstrainResolution(o.constrainResolution);
	}, [view, o.constrainResolution]);

	useEffect(() => {
		view?.setMaxZoom(o.maxZoom);
	}, [view, o.maxZoom]);

	useEffect(() => {
		view?.setMinZoom(o.minZoom);
	}, [view, o.minZoom]);

	useEffect(() => {
		view?.setResolution(o.resolution);
	}, [view, o.resolution]);

	useEffect(() => {
		view?.setRotation(o.rotation);
	}, [view, o.rotation]);

	useEffect(() => {
		if (o.zoom !== undefined) {
			view?.setZoom(o.zoom);
		}
	}, [view, o.zoom]);

	return view ? children : null;
}
