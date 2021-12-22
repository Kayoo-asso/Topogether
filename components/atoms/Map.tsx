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
    // TODO: how to check that we only kept the necessary properties for MapOptions?
    // i.e., that we did not forget to deconstruct any property outside of MapOptions
    ...options
  } = props;

  options.styles = options.styles ? options.styles.concat(mapStyles) : mapStyles;
  options.disableDefaultUI = true;
  options.center = props.center || fontainebleauLocation;


  const elementRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const displayedMarkers = useRef<MapMarker[]>([]);
  const listeners = useRef<google.maps.MapsEventListener[]>([]);

  // Create the map
  // Note: may merge this useEffect with the one setting options, to ensure exhaustive deps checking
  useEffect(() => {
    if (elementRef.current && !map) {
      console.log('Creating map object');
      const newMap = new google.maps.Map(elementRef.current, options);
      setMap(newMap);
    }
  }, [elementRef, map]);

  // Pass the map upward in a ref
  useEffect(() => {
    if (!map || !mapRef) {
      return;
    }

    if (typeof mapRef === 'function') {
      mapRef(map);
    } else {
      mapRef.current = map;
    }
  }, [map]);

  // Note: positions defined by latitude and longitude can be equal, even for different numeric values
  // (since latitudes are clamped between -90 and 90 and longitudes wrap around at 180)
  // This can cause the effect to run again for options that should be considered equivalent to the previous ones.
  // In case that's a problem in practice, see:
  // https://github.com/googlemaps/js-samples/blob/9678b79fbd30b94f64a31645f0e2ef966ac7ad26/samples/react-map/src/index.tsx#L240-L245
  useEffectWithDeepEqual(() => {
    if (map) {
      console.log('Updating map options')
      map.setOptions(options);
      props.onLoad && props.onLoad();
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

  // Q: do I need to unregister all markers on unmount?
  // TODO: profile to see if the markers leak memory

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
  console.log(`Creating marker ${props.id}`);
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
  console.log(`Updating marker ${before.id}, ${after.id}`);
  const marker = before.marker;
  const options: google.maps.MarkerOptions = after.options ?? {};
  console.assert(before.id === after.id)

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
  console.log(`Deleting marker ${marker.id}`);
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