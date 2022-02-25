import React, {
  createContext,
  forwardRef, useEffect, useRef, useState,
} from 'react';
import { useEffectWithDeepEqual } from 'helpers';
import mapStyles from 'styles/mapStyles';
import { mapEvents, MapProps, MarkerProps } from 'types';

const containerStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

export const MapContext = createContext<google.maps.Map>(null!);

type MapMarker = MarkerProps &
{
  marker: google.maps.Marker,
  listeners: google.maps.MapsEventListener[],
};

// Omitting the type tells the compiler that this component takes no props
// Omitting React.PropsWithChildren<T> tells the compiler that this component takes no children
export const Map = forwardRef<google.maps.Map, React.PropsWithChildren<MapProps>>((props, mapRef) => {
  const {
    onBoundsChange,
    onCenterChange,
    onClick,
    onContextMenu,
    onDoubleClick,
    onDrag,
    onDragEnd,
    onDragStart,
    onHeadingChange,
    onIdle,
    onLoad,
    onMapTypeIdChange,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    // onMouseDown,
    // onMouseUp,
    onProjectionChange,
    onTilesLoad,
    onTiltChange,
    onZoomChange,
    className,
    children,
    ...options
  } = props;

  options.styles = options.styles ? options.styles.concat(mapStyles) : mapStyles;
  options.disableDefaultUI = true;
  options.center = props.center;


  const elementRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const displayedMarkers = useRef<MapMarker[]>([]);
  const listeners = useRef<google.maps.MapsEventListener[]>([]);

  // Create the map and pass it upward in a ref
  // Note: may merge this useEffect with the one setting options, to ensure exhaustive deps checking
  useEffect(() => {
    if (elementRef.current && !map) {
      const newMap = new google.maps.Map(elementRef.current, options);

      if (typeof mapRef === "function") {
        mapRef(newMap);
      } else if (mapRef) {
        mapRef.current = newMap;
      }

      setMap(newMap);

      if (onLoad) {
        onLoad(newMap);
      }
    }

    return () => {
      for (const marker of displayedMarkers.current) {
        deleteMarker(marker);
      }
    }
  }, [elementRef, map]);

  // Note: positions defined by latitude and longitude can be equal, even for different numeric values
  // (since latitudes are clamped between -90 and 90 and longitudes wrap around at 180)
  // This can cause the effect to run again for options that should be considered equivalent to the previous ones.
  // In case that's a problem in practice, see:
  // https://github.com/googlemaps/js-samples/blob/9678b79fbd30b94f64a31645f0e2ef966ac7ad26/samples/react-map/src/index.tsx#L240-L245
  useEffectWithDeepEqual(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  // add event listeners
  useEffect(() => {
    if (!map) return;

    for (const [eventName, handlerName] of mapEvents) {
      const handler = props[handlerName];
      if (handler) {
        const listener = map.addListener(eventName, handler);
        listeners.current.push(listener);
      }
    }

    return () => {
      for (const listener of listeners.current) {
        listener.remove();
      }
      listeners.current = [];
    };
    // the map dependency is necessary to make sure event handlers are attached after map creation, or on map update
  }, [map, onBoundsChange, onCenterChange, onClick, onContextMenu, onDoubleClick, onDrag, onDragEnd, onDragStart, onHeadingChange, onIdle, onMapTypeIdChange, onMouseMove, onMouseOut, onMouseOver, 
    // onMouseDown, onMouseUp, 
    onProjectionChange, onTilesLoad, onTiltChange, onZoomChange]);


  // Diff and display markers
  // useEffect(() => {
  //   if (map) {
  //     const newMarkers = diffMarkers(map, displayedMarkers.current, markers);
  //     displayedMarkers.current = newMarkers;
  //   }
  // });

  return (
    <div
      id="map"
      style={containerStyles}
      ref={elementRef}
      className={className}
    >
      {map &&
        <MapContext.Provider value={map}>
          {children}
        </MapContext.Provider>
      }
    </div>
  );
});

Map.displayName = 'Map';

// === MARKER UPDATES ===

function deleteMarker(marker: MapMarker) {
  for (const listener of marker.listeners) {
    listener.remove();
  }
  marker.marker.setMap(null);
}