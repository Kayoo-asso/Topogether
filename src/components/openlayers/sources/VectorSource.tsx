import OLVectorSource from "ol/source/Vector";
import { forwardRef, useEffect } from "react";
import { useLayer } from "../contexts";
import { createLifecycle, InferOptions } from "../createLifecycle";
import { e, vectorSourceEvents } from "../events";

const useBehavior = createLifecycle(OLVectorSource, e(vectorSourceEvents), [
	"attributions",
	"loader",
	"url",
]);

type Props = InferOptions<typeof useBehavior> & React.PropsWithChildren<{}>;

export const VectorSource = forwardRef<OLVectorSource, Props>(
	({ children, ...props }, ref) => {
		const layer = useLayer();
		const source = useBehavior(props, ref);

		useEffect(() => {
			if (source && layer) {
				layer.setSource(source);
				return () => layer.setSource(null);
			}
		}, [layer, source]);

		return <>{children}</>;
	}
);
