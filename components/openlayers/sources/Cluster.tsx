import OLCluster from "ol/source/Cluster";
import { InferOptions, createLifecycle } from "../createLifecycle";
import { forwardRef, useEffect, useState } from "react";
import { useLayer, useMap, useSource } from "../contexts";
import VectorSource from "ol/source/Vector";
import { useGetSources } from "../utils";
import { vectorSourceEvents, e } from "../events";

const useBehavior = createLifecycle(OLCluster, 
	e(vectorSourceEvents),
	["distance", "minDistance"],
	["geometryFunction", "createCluster", "wrapX"],
);

export type ClusterProps = Omit<InferOptions<typeof useBehavior>, "source"> & {
	source: string;
};

export const Cluster = forwardRef<OLCluster, ClusterProps>(
	({ children, source, ...props }, ref) => {
		// const source = useSource();
		const map = useMap();
		const layer = useLayer();
		const [s] = useGetSources(map, [source]);
		const cluster = useBehavior({ ...props }, ref);

		useEffect(() => {
			if(layer && cluster && s) {
				if(!(s instanceof VectorSource)) {
					throw new Error("Cluster `source` can only be a VectorSource");
				}
				// Do those two together, because a Cluster with null source will
				// throw an error when used as a layer source
				cluster.setSource(s);
				layer.setSource(cluster);
				return () => {
					layer.setSource(null);
					cluster.setSource(null);
				}
			}
		}, [cluster, s, layer])

		return <>{children}</>;
	}
);
