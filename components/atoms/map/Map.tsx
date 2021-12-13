import React, {
  forwardRef, useEffect, useRef, useState,
} from 'react';
import { useEffectWithDeepEqual } from 'helpers/hooks/useEffectWithDeepEqual';
import mapStyles from '../../../styles/mapStyles';

type MapProps =
    MapEventHandlers
    & google.maps.MapOptions
    & Styling;

type Styling = {
  className?: string,
};

const containerStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const events = [
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

// Omitting the type tells the compiler that this component takes no props
// Omitting React.PropsWithChildren<T> tells the compiler that this component takes no children
const MapComponent = forwardRef<google.maps.Map, React.PropsWithChildren<MapProps>>((props, mapRef) => {
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
    children,
    // TODO: how to check that we only kept the necessary properties for MapOptions?
    // i.e., that we did not forget to deconstruct any property outside of MapOptions
    ...options
  } = props;

  options.styles = options.styles ? options.styles.concat(mapStyles) : mapStyles;
  options.disableDefaultUI = true;

  const elementRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const listeners = useRef<Map<EventName, google.maps.MapsEventListener>>(new Map());

  // Create the map
  // Note: may merge this useEffect with the one setting options, to ensure exhaustive deps checking
  useEffect(() => {
    if (elementRef.current && !map) {
      const newMap = new google.maps.Map(elementRef.current, options);
      setMap(newMap);
    }
  }, [elementRef, map]);

  // Pass the map upward in a ref
  // TODO: test this thoroughly
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

    for (const [eventName, handlerName] of events) {
      const handler = props[handlerName];
      if (handler) {
        const listener = map.addListener(eventName, handler);
        listeners.current.set(eventName, listener);
      }
    }

    return () => {
      for (const [_, listener] of listeners.current) {
        listener.remove();
      }
      listeners.current.clear();
    };
    // the map dependency is necessary to make sure event handlers are attached after map creation, or on map update
  }, [map, onBoundsChange, onCenterChange, onClick, onContextMenu, onDoubleClick, onDrag, onDragEnd, onDragStart, onHeadingChange, onIdle, onMapTypeIdChange, onMouseMove, onMouseOut, onMouseOver, onProjectionChange, onTilesLoad, onTiltChange, onZoomChange]);

  return (
    <div id="map" style={containerStyles} ref={elementRef} className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // pass the map as a prop to the child component
          return React.cloneElement(child, { map });
        }
      })}
    </div>
  );
});

MapComponent.displayName = 'Map';

export default MapComponent;

type MapMouseEvent = google.maps.MapMouseEvent;
type IconMouseEvent = google.maps.IconMouseEvent;

// === Compile-time check that we have the exact same handler names in the `events` array and the `MapEventHandlers` type ===
// (note: this is an isomorphism proof)
type Events = typeof events;
type EventName = Events[number][0];
type EventHandlerName = Events[number][1];

// These two functions are the proof
function _handlersIsomorphismForward(handler: EventHandlerName): keyof MapEventHandlers {
  return handler;
}

function _handlersIsomorphismBackward(handler: keyof MapEventHandlers): EventHandlerName {
  return handler;
}
