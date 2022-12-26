import OLCluster from "ol/source/Cluster";
import { InferOptions, createLifecycle } from "../createLifecycle";
import { forwardRef, useEffect, useState } from "react";
import { useLayer } from "../contexts";
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

export type ClusterProps = Omit<InferOptions<typeof useBehavior>, "source">;

export const Cluster = forwardRef<OLCluster, ClusterProps>(
	({ children, ...props }, ref) => {
		const [source, setSource] = useState<VectorSource>();
		const layer = useLayer();
		// Cluster can't use the regular `useSource`, because it will update also after Cluster replaces the original
		// source in the layer
		useEffect(() => {
			if (layer) {
				const updateSource = () => {
					const source = layer.getSource() || undefined;
					if (source instanceof OLCluster) {
						return;
					}
					if (source && !(source instanceof VectorSource)) {
						throw new Error(
							"<Cluster /> has to be used inside a <VectorSource /> "
							);
						}
					setSource(source);
				};
				updateSource();
				layer.on("change:source", updateSource);
				return () => {
					layer.un("change:source", updateSource);
					setSource(undefined);
				};
			}
		}, [layer]);
		const cluster = useBehavior({ ...props, source: source }, ref);
		useEffect(() => {
			if (layer && cluster && source) {
				layer.setSource(cluster);
				return () => {
					for(const f of cluster.getFeatures()) {
						if(!source.hasFeature(f)) {
							source.addFeature(f)
						}
					}
					cluster.addFeature
					layer.setSource(source);
					cluster.setSource(null);
					cluster.dispose();
				};
			}
		}, [layer, cluster, source]);
		return <>{children}</>;
	}
);
