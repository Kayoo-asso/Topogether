import React, {
  forwardRef, useEffect, useRef, useState,
} from 'react';
import { useEffectWithDeepEqual } from 'helpers';
import mapStyles from 'styles/mapStyles';
import equal from 'fast-deep-equal/es6';

type MapProps =
  MapEventHandlers
  & google.maps.MapOptions
  & {
    className?: string,
    markers?: MarkerProps[]
  };

const containerStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

type MapEventHandlers = {
  onBoundsChange?: () => void,
  onCenterChange?: () => void,
  onClick?: ((event: MapMouseEvent) => void) | ((event: IconMouseEvent) => void),
  onContextMenu?: (event: MapMouseEvent) => void,
  onDoubleClick?: (event: MapMouseEvent) => void,
  onDrag?: () => void,
  onDragEnd?: () => void,
  onDragStart?: () => void,
  onHeadingChange?: () => void,
  onIdle?: () => void,
  onMapTypeIdChange?: () => void,
  onMouseMove?: (event: MapMouseEvent) => void,
  onMouseOut?: (event: MapMouseEvent) => void,
  onMouseOver?: (event: MapMouseEvent) => void,
  onProjectionChange?: () => void,
  onTilesLoad?: () => void,
  onTiltChange?: () => void
  onZoomChange?: () => void,
};

type MapMouseEvent = google.maps.MapMouseEvent;
type IconMouseEvent = google.maps.IconMouseEvent;

// Omitting the type tells the compiler that this component takes no props
// Omitting React.PropsWithChildren<T> tells the compiler that this component takes no children
export const MapComponent = forwardRef<google.maps.Map, MapProps>((props, mapRef) => {
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

  const elementRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const displayedMarkers = useRef<MapMarker[]>([]);
  const listeners = useRef<google.maps.MapsEventListener[]>([]);

  // Create the map
  // Note: may merge this useEffect with the one setting options, to ensure exhaustive deps checking
  useEffect(() => {
    if (elementRef.current && !map) {
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
  if (map) {
    displayedMarkers.current = diffMarkers(map, displayedMarkers.current, markers);
  }
  // Q: do I need to unregister all markers on unmount?
  // TODO: profile to see if the markers leak memory
  

  return (
    <div id="map" style={containerStyles} ref={elementRef} className={className}>
      {/* {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // pass the map as a prop to the child component
          return React.cloneElement(child, { map });
        }
      })} */}
    </div>
  );
});

MapComponent.displayName = 'Map';

// === ADDITIONAL MAP STUFF ===

const mapEvents = [
  ['bounds_changed', 'onBoundsChange'],
  ['center_changed', 'onCenterChange'],
  ['click', 'onClick'],
  ['contextmenu', 'onContextMenu'],
  ['dblclick', 'onDoubleClick'],
  ['drag', 'onDrag'],
  ['dragend', 'onDragEnd'],
  ['dragstart', 'onDragStart'],
  ['heading_changed', 'onHeadingChange'],
  ['idle', 'onIdle'],
  // no support for 'isfractionalzoomenabled_changed'
  ['maptypeid_changed', 'onMapTypeIdChange'],
  ['mousemove', 'onMouseMove'],
  ['mouseout', 'onMouseOut'],
  ['mouseover', 'onMouseOver'],
  ['projection_changed', 'onProjectionChange'],
  // no support for 'renderingtype_changed'
  // no support for 'rightclick', as 'contextmenu' should be used instead
  // https://developers.google.com/maps/documentation/javascript/reference/3.44/map?hl=en#Map.rightclick
  ['tilesloaded', 'onTilesLoad'],
  ['tilt_changed', 'onTiltChange'],
  ['zoom_changed', 'onZoomChange'],
] as const;

type Events = typeof mapEvents;
type EventName = Events[number][0];
type EventHandlerName = Events[number][1];

// === Compile-time check that we have the exact same handler names in the `events` array and the `MapEventHandlers` type ===
// (this is an isomorphism proof)

// These two functions are the proof
function _handlersIsomorphismForward(handler: EventHandlerName): keyof MapEventHandlers {
  return handler;
}

function _handlersIsomorphismBackward(handler: keyof MapEventHandlers): EventHandlerName {
  return handler;
}

// === MARKER UPDATES ===

// note: may need to copy the after array, since it comes from props
function diffMarkers(map: google.maps.Map, before: MapMarker[], after: MarkerProps[]): MapMarker[] {
  before.sort((a, b) => compareBigInts(a.id, b.id));
  after.sort((a, b) => compareBigInts(a.id, b.id));
  let beforeIdx = 0;
  let afterIdx = 0;
  let result: MapMarker[] = new Array(after.length);

  while (beforeIdx < before.length && afterIdx < after.length) {
    const existing = before[beforeIdx];
    const incoming = after[afterIdx];
    // Process the one with lowest ID first, or compare both if the IDs are equal
    switch (compareBigInts(existing.id, incoming.id)) {
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

// when comparing bigints in Array.sort, we can't return `a - b` like we'd do with numbers,
// since the result of a compare function should be a number, not a bigint.
const compareBigInts = (a: bigint, b: bigint) => (a < b) ? - 1 : ((a > b) ? 1 : 0)

function createMarker(props: MarkerProps, map: google.maps.Map): MapMarker {
  // avoid an extra call to marker.setMap by including it into the options
  const options: google.maps.MarkerOptions = props.options;
  options.map = map;
  const marker = new google.maps.Marker(options);
  const listeners = [];
  for (const [eventName, handlerName] of markerEvents) {
    const handler = props.handlers[handlerName];
    if (handler) {
      const listener = marker.addListener(eventName, handler);
      listeners.push(listener);
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
  const options = after.options;
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
    for (const [eventName, handlerName] of markerEvents) {
      const handler = after.handlers[handlerName];
      if (handler) {
        const listener = marker.addListener(eventName, handler);
        listeners.push(listener);
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

// === MARKER TYPES ===

const markerEvents = [
  ['animation_changed', 'onAnimationChange'],
  ['click', 'onClick'],
  ['clickable_changed', 'onClickableChange'],
  ['contextmenu', 'onContextMenu'],
  ['cursor_changed', 'onCursorChange'],
  ['dblclick', 'onDoubleClick'],
  ['drag', 'onDrag'],
  ['dragend', 'onDragEnd'],
  ['draggable_changed', 'onDraggableChange'],
  ['dragstart', 'onDragStart'],
  ['flat_changed', 'onFlatChange'],
  ['icon_changed', 'onIconChange'],
  ['mousedown', 'onMouseDown'],
  ['mouseout', 'onMouseOut'],
  ['mouseover', 'onMouseOver'],
  ['mouseup', 'onMouseUp'],
  ['position_changed', 'onPositionChange'],
  // no support for onRightClick, since onContextMenu should be used instead
  // https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
  ['shape_changed', 'onShapeChange'],
  ['title_changed', 'onTitleChange'],
  ['visible_changed', 'onVisibleChange'],
  ['zindex_changed', 'onZIndexChange'],
] as const;

type MapMarker = MarkerProps &
{
  marker: google.maps.Marker,
  listeners: google.maps.MapsEventListener[],
};

// A separate MarkerEventHandlers type to make compile-time checks easier (see below)
type MarkerEventHandlers = {
  onAnimationChange?: () => void,
  onClick?: (event: MapMouseEvent) => void,
  onClickableChange?: () => void,
  onContextMenu?: (event: MapMouseEvent) => void,
  onCursorChange?: () => void,
  onDoubleClick?: (event: MapMouseEvent) => void,
  onDrag?: (event: MapMouseEvent) => void,
  onDragEnd?: (event: MapMouseEvent) => void,
  onDraggableChange?: () => void,
  onDragStart?: (event: MapMouseEvent) => void,
  onFlatChange?: () => void,
  onIconChange?: () => void,
  onMouseDown?: (event: MapMouseEvent) => void,
  onMouseOut?: (event: MapMouseEvent) => void,
  onMouseOver?: (event: MapMouseEvent) => void,
  onMouseUp?: (event: MapMouseEvent) => void,
  onPositionChange?: () => void,
  // no support for onRightClick, since onContextMenu should be used instead
  // https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
  onShapeChange?: () => void,
  onTitleChange?: () => void,
  onVisibleChange?: () => void,
  onZIndexChange?: () => void,
};

interface MarkerProps {
  id: bigint,
  options: Omit<google.maps.MarkerOptions, 'map'>,
  handlers: MarkerEventHandlers
};


// === Compile-time check that we have the exact same handler names in the `events` array and the `MarkerEventHandlers` type ===
// (note: this is an isomorphism proof)
type MarkerEvents = typeof markerEvents;
type MarkerEventName = MarkerEvents[number][0];
type MarkerEventHandlerName = MarkerEvents[number][1];

// These two functions are the proof
function _markerHandlersIsomorphismForward(handler: MarkerEventHandlerName): keyof MarkerEventHandlers {
  return handler;
}

function _markerHandlersIsomorphismBackward(handler: keyof MarkerEventHandlers): MarkerEventHandlerName {
  return handler;
}

