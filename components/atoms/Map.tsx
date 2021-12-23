import React, {
  forwardRef, useEffect, useRef, useState,
} from 'react';
import { useEffectWithDeepEqual } from 'helpers';
import mapStyles from 'styles/mapStyles';
import equal from 'fast-deep-equal/es6';
import { mapEvents, MapProps, markerEvents, MarkerProps, UUID } from 'types';
import { fontainebleauLocation } from 'helpers/globals';

const containerStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

// Omitting the type tells the compiler that this component takes no props
// Omitting React.PropsWithChildren<T> tells the compiler that this component takes no children
export const Map = forwardRef<google.maps.Map, MapProps>((props, mapRef) => {
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
    onProjectionChange,
    onTilesLoad,
    onTiltChange,
    onZoomChange,
    className,
    // don't forget the default value
    markers = [],
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
      } else if(mapRef) {
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
  }, [map, onBoundsChange, onCenterChange, onClick, onContextMenu, onDoubleClick, onDrag, onDragEnd, onDragStart, onHeadingChange, onIdle, onMapTypeIdChange, onMouseMove, onMouseOut, onMouseOver, onProjectionChange, onTilesLoad, onTiltChange, onZoomChange]);


  // Diff and display markers
  useEffect(() => {
    if (map) {
      const newMarkers = diffMarkers(map, displayedMarkers.current, markers);
      displayedMarkers.current = newMarkers;
    }
  });

  return (
    <div
      id="map"
      style={containerStyles}
      ref={elementRef}
      className={className}
    >
    </div>
  );
});

Map.displayName = 'Map';

// === MARKER UPDATES ===

// note: may need to copy the after array, since it comes from props
function diffMarkers(map: google.maps.Map, before: MapMarker[], after: MarkerProps[]): MapMarker[] {
  // before is already sorted, due to how we construct it every time
  after.sort((a, b) => compareIds(a.id, b.id));
  let beforeIdx = 0;
  let afterIdx = 0;
  let result: MapMarker[] = new Array(after.length);

  while (beforeIdx < before.length && afterIdx < after.length) {
    const existing = before[beforeIdx];
    const incoming = after[afterIdx];
    // Process the one with lowest ID first, or compare both if the IDs are equal
    switch (compareIds(existing.id, incoming.id)) {
      // existing.id < incoming.id
      case -1:
        deleteMarker(existing);
        beforeIdx++;
        break;

      // existing.id == incoming.id
      case 0:
        result[afterIdx] = updateMarker(existing, incoming);

        beforeIdx++;
        afterIdx++;
        break;

      // existing.id > incoming.id
      case 1:
        result[afterIdx] = createMarker(incoming, map);
        afterIdx++;
        break;
    }
  }
  // In case before and after don't have the same length
  // Only one of the two loops actually runs each time
  while (beforeIdx < before.length) {
    const existing = before[beforeIdx];
    deleteMarker(existing);
    beforeIdx++;
  }

  while (afterIdx < after.length) {
    const incoming = after[afterIdx];
    result[afterIdx] = createMarker(incoming, map);
    afterIdx++;
  }

  return result;
}

const compareIds = (a: UUID, b: UUID) => (a < b) ? - 1 : ((a > b) ? 1 : 0)

function createMarker(props: MarkerProps, map: google.maps.Map): MapMarker {
  // avoid an extra call to marker.setMap by including it into the options
  const options: google.maps.MarkerOptions = props.options ?? {};
  options.map = map;
  const marker = new google.maps.Marker(options);
  const listeners = [];
  if (props.handlers) {
    for (const [eventName, handlerName] of markerEvents) {
      const handler = props.handlers[handlerName];
      if (handler) {
        const listener = marker.addListener(eventName, handler);
        listeners.push(listener);
      }
    }
  }
  return {
    marker,
    listeners,
    ...props
  }
}

function updateMarker(before: MapMarker, after: MarkerProps): MapMarker {
  const marker = before.marker;
  const options: google.maps.MarkerOptions = after.options ?? {};

  // Q: does it matter if we don't inject the map into the `after` options
  if (!equal(before.options, options)) {
    marker.setOptions(options)
  }

  const result: MapMarker = {
    marker,
    listeners: [],
    ...after
  }

  // We could have more fine-grained control by checking and updating each handler
  // individually, but I'm not sure the performance would be that much better
  if (!equal(before.handlers, after.handlers)) {
    for (const listener of before.listeners) {
      listener.remove();
    }
    const listeners: google.maps.MapsEventListener[] = [];
    if (after.handlers) {
      for (const [eventName, handlerName] of markerEvents) {
        const handler = after.handlers[handlerName];
        if (handler) {
          const listener = marker.addListener(eventName, handler);
          listeners.push(listener);
        }
      }
    }
    result.listeners = listeners;
  }

  return result;
}

function deleteMarker(marker: MapMarker) {
  for (const listener of marker.listeners) {
    listener.remove();
  }
  marker.marker.setMap(null);
}

type MapMarker = MarkerProps &
{
  marker: google.maps.Marker,
  listeners: google.maps.MapsEventListener[],
};