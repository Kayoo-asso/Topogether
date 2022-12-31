import EventType from "ol/events/EventType";
import Feature from "ol/Feature";
import Point from "ol/geom/Point.js";
import VectorSource from "ol/source/Vector";
import { add as addCoordinate, scale as scaleCoordinate } from "ol/coordinate";
import { assert } from "ol/asserts";
import {
	Extent,
	buffer,
	createEmpty,
	createOrUpdateFromCoordinate,
	getCenter,
} from "ol/extent";
import { getUid } from "ol/util";
import { AttributionLike } from "ol/source/Source";
import { Projection } from "ol/proj";
import VectorEventType from "ol/source/VectorEventType";
import { Fill, Style } from "ol/style";
import { Geometry } from "ol/geom";
import { StyleLike } from "ol/style/Style";

interface Options {
	attributions?: AttributionLike;
	distance?: number;
	minDistance?: number;
	geometryFunction?: (feature: Feature) => Point;
	createCluster?: (
		clusterCenter: Point,
		clusterFeatures: Array<Feature>
	) => Feature;
	source?: VectorSource | null;
	hideInSource?: boolean;
	wrapX?: boolean;
}

interface CopyInformation {
	copy: Feature<Geometry>;
	origStyle: StyleLike | undefined;
}

const defaultOptions = {
	distance: 20,
	minDistance: 0,
	wrapX: true,
	hideInSource: true,
	geometryFunction(feature: Feature) {
		const geometry = feature.getGeometry() as Point;
		assert(geometry.getType() == "Point", 10); // The default `geometryFunction` can only handle `Point` geometries
		return geometry;
	},
}; // satisfies Options;
// TODO: add back `satisfies` once we upgrade React + Next

const invisibleStyle = new Style();

/**
 * Layer source to cluster vector data. Works out of the box with point
 * geometries. For other geometry types, or if not all geometries should be
 * considered for clustering, a custom `geometryFunction` can be defined.
 *
 * If the instance is disposed without also disposing the underlying
 * source `setSource(null)` has to be called to remove the listener reference
 * from the wrapped source.
 */
export class ClusterSource extends VectorSource {
	// -- Options --
	distance: number;
	minDistance: number;
	hideInSource: boolean;
	source: VectorSource | null = null;
	geometryFunction: (feature: Feature) => Point;
	createCustomCluster_?: (
		clusterCenter: Point,
		clusterFeatures: Array<Feature>
	) => Feature;
	// -- Internal stuff --
	protected resolution: number | undefined = undefined;
	protected interpolationRatio: number = 0;
	// When we cluster features, we create a copy with the data (geometry, properties)
	// and set the original feature's style to `invisibleStyle`, to hide it.
	// (if `hideInSource` is true, at least)
	// We keep track of the mapping between source features and copies here.
	// This can also act as a collection of all features currently in clusters.
	protected hidden: Map<Feature, StyleLike | undefined> = new Map();
	protected boundRefresh_: () => void = this.refresh.bind(this);

	constructor(userOptions: Options) {
		const options = { ...defaultOptions, ...userOptions };

		super({
			attributions: options.attributions,
			wrapX: userOptions.wrapX || true,
		});

		this.distance = options.distance;
		this.minDistance = options.minDistance;
		this.geometryFunction = options.geometryFunction;
		this.createCustomCluster_ = options.createCluster;
		this.hideInSource = options.hideInSource;
		this.boundRefresh_ = this.refresh.bind(this);

		this.updateDistance(this.distance, this.minDistance);
		this.setSource(options.source || null);
	}

	/**
	 * Get the distance in pixels between clusters.
	 */
	getDistance() {
		return this.distance;
	}

	/**
	 * Get a reference to the wrapped source.
	 */
	getSource() {
		return this.source;
	}

	loadFeatures(extent: Extent, resolution: number, projection: Projection) {
		if (this.source) {
			this.source.loadFeatures(extent, resolution, projection);
			if (resolution !== this.resolution) {
				this.resolution = resolution;
				this.refresh();
			}
		}
	}

	/**
	 * Set the distance within which features will be clusterd together.
	 */
	setDistance(distance: number) {
		this.updateDistance(distance, this.minDistance);
	}

	/**
	 * Set the minimum distance between clusters. Will be capped at the
	 * configured distance.
	 */
	setMinDistance(minDistance: number) {
		this.updateDistance(this.distance, minDistance);
	}

	/**
	 * The configured minimum distance between clusters.
	 */
	getMinDistance() {
		return this.minDistance;
	}

	/**
	 * Replace the wrapped source.
	 */
	setSource(source: VectorSource | null) {
		if (this.source) {
			this.source.removeEventListener(
				VectorEventType.CHANGEFEATURE,
				this.boundRefresh_
			);
		}
		this.source = source;
		if (source) {
			source.addEventListener(
				VectorEventType.CHANGEFEATURE,
				this.boundRefresh_
			);
		}
		this.refresh();
	}

	/**
	 * Handle the source changing.
	 */
	refresh() {
		// Original code
		this.clear();
		// Goals:
		// 1. rebuild an Array of features for the clusters
		// 2. set style of source features newly added to clusters
		// 3. restore style of features removed from clusters
		// 1. + 2. are achieved during the clustering process
		// 3. is achieved by taking a set difference after finishing the clustering
		const inClusters: Set<Feature> = new Set();
		// Every time we add a feature to a cluster, we'll remove it from here
		// At the end, this set will only contain the deleted features
		const notInClusters: Set<Feature> = new Set(this.hidden.keys());

		// Original code -> copy pasted and slightly changed here
		if (this.resolution === undefined || !this.source) {
			return;
		}
		const mapDistance = this.distance * this.resolution;
		// NOTE: we'll have to handle features that may have been
		// readded back to the source by some other process
		const srcFeatures = this.source.getFeatures();

		// Create empty extent outside the loop for reuse
		const clusters: Array<Feature> = [];
		const extent = createEmpty();
		for (let i = 0; i < srcFeatures.length; ++i) {
			const feature = srcFeatures[i];
			if (!inClusters.has(feature)) {
				const geom = this.geometryFunction(feature);
				if (geom) {
					const coords = geom.getCoordinates();
					// Reset the extent to only contain the coordinates above
					createOrUpdateFromCoordinate(coords, extent);
					// The extent in which we'll look for features to cluster
					buffer(extent, mapDistance, extent);

					// Important: inCluster will also find the feature we're currently examining
					const neighbors = this.source
						.getFeaturesInExtent(extent)
						.filter((f) => !inClusters.has(f));
					// Only create clusters with 2+ features
					if (neighbors.length > 1) {
						for (let y = 0; y < neighbors.length; y++) {
							const feature = neighbors[y];
							this.beforeAddingToCluster(feature);
							inClusters.add(feature);
							notInClusters.delete(feature);
						}
						const cluster = this.createCluster(neighbors, extent);
						clusters.push(cluster);
					}
				}
			}
		}

		for (const deleted of Array.from(notInClusters)) {
			this.removeFromClusters(deleted);
		}
		this.addFeatures(clusters);
	}

	protected beforeAddingToCluster(feature: Feature<Geometry>) {
		if (!this.hidden.has(feature)) {
			this.hidden.set(feature, feature.getStyle());
			if (this.hideInSource) {
				feature.setStyle(invisibleStyle);
			}
		}
	}

	protected removeFromClusters(feature: Feature<Geometry>): void {
		const origStyle = this.hidden.get(feature);
		// do this before feature.setStyle, to avoid this infinite loop:
		// feature.setStyle => event => refresh => feature still in `hidden`
		this.hidden.delete(feature);
		feature.setStyle(origStyle);
	}

	/**
	 * Update the distances and refresh the source if necessary.
	 */
	updateDistance(distance: number, minDistance: number) {
		const ratio =
			distance === 0 ? 0 : Math.min(minDistance, distance) / distance;
		const changed =
			distance !== this.distance || this.interpolationRatio !== ratio;
		this.distance = distance;
		this.minDistance = minDistance;
		this.interpolationRatio = ratio;
		if (changed) {
			this.refresh();
		}
	}

	protected createCluster(features: Array<Feature>, extent: Extent) {
		const centroid = [0, 0];
		for (let i = features.length - 1; i >= 0; --i) {
			const geometry = this.geometryFunction(features[i]);
			if (geometry) {
				addCoordinate(centroid, geometry.getCoordinates());
			} else {
				features.splice(i, 1);
			}
		}
		scaleCoordinate(centroid, 1 / features.length);
		const searchCenter = getCenter(extent);
		const ratio = this.interpolationRatio;
		const geometry = new Point([
			centroid[0] * (1 - ratio) + searchCenter[0] * ratio,
			centroid[1] * (1 - ratio) + searchCenter[1] * ratio,
		]);
		if (this.createCustomCluster_) {
			return this.createCustomCluster_(geometry, features);
		}
		return new Feature({
			geometry,
			features,
		});
	}
}
