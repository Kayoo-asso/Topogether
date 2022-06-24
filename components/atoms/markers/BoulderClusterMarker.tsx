import { centerFromLatLngs, MapContext, markerSize, toLatLng, useCluster, useMarker } from 'helpers';
import React, { useCallback, useContext } from 'react';
import { Boulder, MarkerEventHandlers } from 'types';

interface BoulderClusterMarkerProps {
    boulders: Boulder[],
}

export const BoulderClusterMarker: React.FC<BoulderClusterMarkerProps> = (props: BoulderClusterMarkerProps) => {
    const boulders = props.boulders;
    // const map = useContext(MapContext);

    const icon: google.maps.Icon = {
        url: '/assets/icons/colored/_rock.svg',
        scaledSize: markerSize(30),
        labelOrigin: new google.maps.Point(15, 34)
    }

    const markers = boulders.map(boulder => {
        const options: google.maps.MarkerOptions = {
            icon,
            position: toLatLng(boulder.location),
            opacity: 1,
            label: {
                text: boulder.name,
                color: '#04D98B',
                fontFamily: 'Poppins',
                fontWeight: '500'
            }
        };
        const handlers: MarkerEventHandlers = {
            onClick: useCallback(() => alert("ok"), []),
        }     
        let marker = new google.maps.Marker({
            ...options,
            ...handlers
        })
        return marker 
    })

    useCluster(markers);
   
    // const options: google.maps.MarkerOptions = {
    //     icon,
    //     position: toLatLng(centerFromLatLngs(boulders.map(b => b.location))),
    //     opacity: 1,
    //     label: {
    //         text: boulders.length.toString(),
    //         color: '#04D98B',
    //         fontFamily: 'Poppins',
    //         fontWeight: '500'
    //     }
    // };

    // const handlers: MarkerEventHandlers = {
    //     onClick: useCallback(() => alert("ok"), []),
    // }

    return null;
}

BoulderClusterMarker.displayName = "BoulderClusterMarker";