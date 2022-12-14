import React from 'react';
import { watchDependencies } from 'helpers/quarky';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Fill, Stroke, Style, Circle } from 'ol/style';
import { usePosition } from 'helpers/hooks';
import { MapBrowserEvent } from 'ol';

interface UserMarkerLayerProps {
    onClick?: (e: MapBrowserEvent<any>) => void,
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
    // console.log(toLonLat(position))

    const accuracyMarkerStyle = () => {
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
    }

    return (
        <>
            <Select
                layers={["user"]}
                hitTolerance={2}
                onSelect={(e) => {
                    e.mapBrowserEvent.stopPropagation();
                    e.mapBrowserEvent.preventDefault();
                    props.onClick && props.onClick(e.mapBrowserEvent);
                    e.target.getFeatures().clear();
                }}
            />

            <VectorLayer
                id="userAccuracy"     
                style={accuracyMarkerStyle}
            >
                <VectorSource>
                    {accuracy && position &&
                        <Point
                            coordinates={[position[1], position[0]]}
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
                            coordinates={[position[1], position[0]]}
                        />
                    }
                </VectorSource>
            </VectorLayer>
        </>
    )
})

UserMarkerLayer.displayName = "UserMarkerLayer";