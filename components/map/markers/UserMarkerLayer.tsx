import React, { useCallback } from 'react';
import { watchDependencies } from 'helpers/quarky';
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

interface UserMarkerLayerProps {
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

    const accuracyMarkerStyle = useCallback(() => {
        if (!accuracy) return;
        const image = new Circle({
            radius: accuracy,
            fill: new Fill({
              color: 'rgba(31, 67, 100, 0.2)',
            }),
        });
        return new Style({
            image,
            zIndex: 2
        });
    }, [accuracy]);

    return (
        <>
            <Select
                layers={["user"]}
                hitTolerance={2}
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