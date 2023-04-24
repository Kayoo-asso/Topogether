import Feature from "ol/Feature";
import Point from "ol/geom/Point";
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
import type { AttributionLike } from "ol/source/Source";
import type { Projection } from "ol/proj";
import VectorEventType from "ol/source/VectorEventType";
import Geometry from "ol/geom/Geometry";
import Style from "ol/style/Style";
import { type StyleLike } from "ol/style/Style";

// TODO:
// - add more specific event handlers:
//   -> feature added / changed / removed = incremental patch
//   -> resolution change = recalculation

interface Options {
	attributions?: AttributionLike;
	distance?: number;
	minDistance?: number;
	minFeatures?: number;
	wrapX?: boolean;
	styleWhileInCluster?: StyleLike | undefined;
	source?: VectorSource | null;
	geometryFunction?: (feature: Feature) => Point;
	createCluster?: (
		clusterCenter: Point,
		clusterFeatures: Array<Feature>
	) => Feature;
}

const defaultOptions = {
	distance: 20,
	minDistance: 0,
	minFeatures: 2,
	wrapX: true,
	hideInSource: true,
	styleWhileInCluster: new Style(),
	geometryFunction(feature: Feature) {
		const geometry = feature.getGeometry() as Point;
		assert(geometry.getType() == "Point", 10); // The default `geometryFunction` can only handle `Point` geometries
		return geometry;
	},
}; // satisfies Options;
// TODO: add back `satisfies` once we upgrade React + Next

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
	minFeatures: number;
	styleWhileInCluster: StyleLike | undefined;
	source: VectorSource | null = null;
	geometryFunction: (feature: Feature) => Point;
	createCustomCluster_?: (
		clusterCenter: Point,
		clusterFeatures: Array<Feature>
	) => Feature;
	// Avoid infinite loops when clearing / refreshing
	protected busy: boolean;
	// -- Internal stuff --
	protected resolution: number | undefined = undefined;
	protected interpolationRatio: number = 0;
	// When we cluster features, we create a copy with the data (geometry, properties)
	// and set the original feature's style to `invisibleStyle`, to hide it.
	// (if `hideInSource` is true, at least)
	// We keep track of the mapping between source features and copies here.
	// This can also act as a collection of all features currently in clusters.
	protected originalStyles: Map<Feature, StyleLike | undefined> = new Map();
	protected boundRefresh_: () => void = this.refresh.bind(this);

	constructor(userOptions: Options) {
		super({
			attributions: userOptions.attributions,
			wrapX: userOptions.wrapX || true,
		});

		const options = { ...defaultOptions, ...userOptions };

		this.distance = options.distance;
		this.minDistance = options.minDistance;
		this.minFeatures = options.minFeatures;
		this.styleWhileInCluster = options.styleWhileInCluster;
		this.geometryFunction = options.geometryFunction;
		this.createCustomCluster_ = options.createCluster;
		this.boundRefresh_ = this.refresh.bind(this);

		this.busy = false;

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
				VectorEventType.ADDFEATURE,
				this.boundRefresh_
			);
			this.source.removeEventListener(
				VectorEventType.CHANGEFEATURE,
				this.boundRefresh_
			);
			this.source.removeEventListener(
				VectorEventType.REMOVEFEATURE,
				this.boundRefresh_
			);
		}
		this.source = source;
		if (source) {
			source.addEventListener(VectorEventType.ADDFEATURE, this.boundRefresh_);
			source.addEventListener(
				VectorEventType.CHANGEFEATURE,
				this.boundRefresh_
			);
			source.addEventListener(
				VectorEventType.REMOVEFEATURE,
				this.boundRefresh_
			);
		}
		this.refresh();
	}

	clear(fast?: boolean | undefined): void {
		this.busy = true;
		for (const [feature, origStyle] of Array.from(this.originalStyles)) {
			// do this first to avoid an infinite loop, since Feature.setStyle()
			// will trigger an `update` event on the source
			this.originalStyles.delete(feature);
			feature.setStyle(origStyle);
		}
		super.clear(fast);
		this.busy = false;
	}

	/**
	 * Handle the source changing.
	 */
	refresh() {
		if (this.busy) {
			return;
		}
		this.clear();
		// `clear` resets `this.busy` to `false` at the end
		this.busy = true;
		const inClusters: Set<Feature> = new Set();

		// Inlined `cluster()` function from the original code, slightly modified
		if (this.resolution === undefined || !this.source) {
			this.busy = false;
			return;
		}
		const mapDistance = this.distance * this.resolution;
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
					const neighbors = this.source.getFeaturesInExtent(extent);
					const candidates: Array<Feature> = [];
					// Filter features that have already been added to other clusters
					for (let y = 0; y < neighbors.length; ++y) {
						const feature = neighbors[y];
						if (!inClusters.has(feature)) {
							inClusters.add(feature);
							candidates.push(feature);
						}
					}
					// Only create clusters with enough features to clear the threshold
					if (candidates.length > this.minFeatures) {
						for (let y = 0; y < candidates.length; ++y) {
							const feature = candidates[y];
							this.applyHiddenStyle(feature);
							inClusters.add(feature);
						}
						const cluster = this.createCluster(candidates, extent);
						clusters.push(cluster);
					}
				}
			}
		}

		this.addFeatures(clusters);
		this.busy = false;
	}

	protected applyHiddenStyle(feature: Feature<Geometry>) {
		if (!this.originalStyles.has(feature)) {
			this.originalStyles.set(feature, feature.getStyle());
			feature.setStyle(this.styleWhileInCluster);
		}
	}

	protected restoreOrigStyle(feature: Feature<Geometry>): void {
		const origStyle = this.originalStyles.get(feature);
		// do this before feature.setStyle, to avoid this infinite loop:
		// feature.setStyle => event => refresh => feature still in `hidden`
		this.originalStyles.delete(feature);
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
