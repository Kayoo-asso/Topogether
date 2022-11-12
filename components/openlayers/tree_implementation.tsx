import { ViewNode, MapNode, Node } from "./tree";
import ViewObject, { ViewOptions } from "ol/View";
import MapObject, { MapOptions } from "ol/Map";
import {
	createContext,
	CSSProperties,
	forwardRef,
	PropsWithChildren,
	useContext,
	useRef,
	useState,
} from "react";
import BaseLayer from "ol/layer/Base";
import Source from "ol/source/Source";
import Interaction from "ol/interaction/Interaction";

interface Context {
	node: Node
}

const emptyNode: ViewNode = {
	o: {},
	r: null,
	c: null
}

const Context = createContext<Context>({
	node: emptyNode
});

const useCtx = () => useContext(Context);

const LAYERS: Array<BaseLayer> = [];
const SOURCES: Array<Source> = [];
const INTERACTIONS: Array<Interaction> = [];

type ViewProps = PropsWithChildren<ViewOptions>;

export const View = forwardRef<ViewObject, ViewProps>(
	({ children, ...o }, ref) => {
		const root = useRef<ViewNode>({
			o,
			r: ref,
			c: null,
		});
		// Will be mutated by children
		const context = useRef<Context>({
			node: root.current
		});
		// For diffing
		const prevRoot = useRef(root.current);

		prevRoot.current = root.current;
		root


		return <Context.Provider value={context.current}>{children}</Context.Provider>;
	}
);

type MapProps = PropsWithChildren<
	Omit<
		MapOptions,
		"controls" | "interactions" | "layers" | "overlays" | "target" | "view"
	>
> & {
	className?: string;
	style?: CSSProperties;
};

let existingMaps = 0;

export const Map__ = forwardRef<MapObject, MapProps>(
	({ children, style, className, ...o }, ref) => {
		const tree = useCtx();

		// tree.c = {
		// 	o,
		// 	// No children yet
		// 	c: [],
		// };

		// TODO: look into better ways to generate numeric IDs for components, that are stable between SSR and CSR
		const counter = useState(() => existingMaps++);
		const elementId = `map-${counter}`;

		return (
			<div className={className} style={style} id={elementId}>
				{children}
			</div>
		);
	}
);
