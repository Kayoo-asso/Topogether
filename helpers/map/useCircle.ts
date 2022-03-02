import { MapContext } from "components";
import { useEffectWithDeepEqual } from "helpers";
import { useContext, useEffect, useRef } from "react";

export function useCircle(options: google.maps.CircleOptions) {
    const circle = useRef<google.maps.Circle>();
    const map = useContext(MapContext);

    useEffect(() => {
        if (!circle.current) {
            circle.current = new google.maps.Circle({
                ...options,
                map
            });
        }
        return () => {
            if (circle.current) {
                circle.current.setMap(null);
            }
        }
    // do not include marker as a dependency here
    }, [map]);

    useEffectWithDeepEqual(() => {
        if (circle.current) {
            circle.current.setOptions({
                ...options,
                map,
            })
        }
    }, [circle.current, options])
}