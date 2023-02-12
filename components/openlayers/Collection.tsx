import OLCollection from "ol/Collection";
import { createLifecycle } from "./createLifecycle";
import {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { CollectionContext } from "./contexts";
import type Feature from "ol/Feature";

interface CollectionProps {
	id: string;
}

const rootCollection = new OLCollection<OLCollection<Feature>>();

export const Collection = forwardRef<OLCollection<Feature>, React.PropsWithChildren<CollectionProps>>(
	(props, ref) => {
		const [collection] = useState(() => new OLCollection<Feature>());
    console.log("Collection " + props.id, collection)

		useImperativeHandle(ref, () => collection, [collection]);

		useEffect(() => {
			rootCollection.set(props.id, collection);
			return () => {
				rootCollection.remove(collection);
			};
		}, [props.id, collection]);

		return (
			<CollectionContext.Provider value={collection}>
				{props.children}
			</CollectionContext.Provider>
		);
	}
);

export function useCollection(id: string | undefined) {
  // Collection.get(undefined) is actually fine, but the types don't like it
	const [collection, setCollection] = useState(
		rootCollection.get(id as string) as OLCollection<Feature> | undefined
	);

	useEffect(() => {
    // Collection.get(undefined) is actually fine, but the types don't like it
		const updateCollection = () => setCollection(rootCollection.get(id as string));
		rootCollection.on("propertychange", updateCollection);
		return () => {
			rootCollection.un("propertychange", updateCollection);
		};
	}, []);

	return collection;
}
