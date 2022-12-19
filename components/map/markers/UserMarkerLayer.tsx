import React, { useCallback } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Fill, Stroke, Style, Circle } from 'ol/style';
import { usePosition } from 'helpers/hooks';
import { GeoCoordinates } from 'types';
import { fromLonLat } from 'ol/proj';
import { Map } from 'ol';

interface UserMarkerLayerProps {
    map?: Map;
    mapZoom?: Quark<number>;
    onClick?: (pos: GeoCoordinates | null) => void,
}

export const userMarkerStyle = () => {
    const image = new Circle({
        radius: 6,
        fill: new Fill({
          color: '#4EABFF',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2,
        }),
    });
    return new Style({
        image,
        zIndex: 5
    });
}

export const UserMarkerLayer: React.FC<UserMarkerLayerProps> = watchDependencies((props: UserMarkerLayerProps) => {
    const { position, accuracy } = usePosition();
    // console.log(accuracy);

    const accuracyMarkerStyle = useCallback(() => {
        if (!accuracy || !props.mapZoom) return;
        // const r = Math.min(accuracy, 60)/100 * (props.mapZoom()**4 / 200)
        // console.log(r);
        const image = new Circle({
            radius: accuracy,
            fill: new Fill({
              color: 'rgba(31, 67, 100, 0.3)',
            }),
        });
        return new Style({
            image,
            zIndex: 2
        });
    }, [accuracy, props.mapZoom]);

    return (
        <>
            <Select
                layers={["user", "userAccuracy"]}
                hitTolerance={1}
                onSelect={useCallback((e) => {
                    e.mapBrowserEvent.stopPropagation();
                    e.mapBrowserEvent.preventDefault();
                    props.onClick && props.onClick(position);
                    e.target.getFeatures().clear();
                }, [position])}
            />

            <VectorLayer
                id="userAccuracy"
                style={accuracyMarkerStyle}
            >
                <VectorSource>
                    {accuracy && position &&
                        <Point
                            coordinates={fromLonLat(position)}
                        />
                    }
                </VectorSource>
            </VectorLayer>

            <VectorLayer
                id="user"     
                style={userMarkerStyle}
            >
                <VectorSource>
                    {position &&
                        <Point
                            coordinates={fromLonLat(position)}
                        />
                    }
                </VectorSource>
            </VectorLayer>
        </>
    )
})

UserMarkerLayer.displayName = "UserMarkerLayer";