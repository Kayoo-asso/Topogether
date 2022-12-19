import OLCluster from "ol/source/Cluster";
import { InferOptions, createLifecycle } from "../createLifecycle";
import { forwardRef, useEffect } from "react";
import { useLayer, useSource } from "../contexts";
import VectorSource from "ol/source/Vector";

const useBehavior = createLifecycle(OLCluster, {
	events: [
		"addfeature",
		"change",
		"changefeature",
		"clear",
		"error",
		"featuresloadend",
		"featuresloaderror",
		"featuresloadstart",
		"propertychange",
		"removefeature",
	],
	reactive: ["distance", "minDistance"],
	reset: ["source", "geometryFunction", "createCluster", "wrapX"],
});

export type ClusterProps = Omit<InferOptions<typeof useBehavior>, "source"> 

export const Cluster = forwardRef<OLCluster, ClusterProps>(
	({ children, ...props }, ref) => {
		const source = useSource();
		if (source && !(source instanceof VectorSource)) {
			throw new Error(
				"<Cluster> component needs to be used inside a vector source."
			);
		}
		const cluster = useBehavior(
			{ ...props, source: source as VectorSource | undefined },
			ref
		);
		const layer = useLayer();
		useEffect(() => {
			if (layer && cluster) {
				layer.setSource(cluster);
				return () => {
					layer.setSource(cluster.getSource());
					cluster.setSource(null);
					cluster.dispose();
				};
			}
		}, [layer, cluster]);
		return <>{children}</>;
	}
);

<Cluster   />