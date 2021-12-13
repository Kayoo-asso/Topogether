import {
  FC, useEffect, useRef, useState,
} from 'react';
import { useEffectWithDeepEqual } from 'helpers/hooks/useEffectWithDeepEqual';

// The reference to the map object is passed within the options
const Marker: FC<MarkerProps> = (props) => {
  const {
    onAnimationChange,
    onClick,
    onClickableChange,
    onContextMenu,
    onCursorChange,
    onDoubleClick,
    onDrag,
    onDragEnd,
    onDragStart,
    onDraggableChange,
    onFlatChange,
    onIconChange,
    onMouseDown,
    onMouseOut,
    onMouseOver,
    onMouseUp,
    onPositionChange,
    onShapeChange,
    onTitleChange,
    onVisibleChange,
    onZIndexChange,
    children: _children, // not used
    ...options
  } = props;

  const [marker, setMarker] = useState<google.maps.Marker>();
  const listeners = useRef<Map<EventName, google.maps.MapsEventListener>>(new Map());

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffectWithDeepEqual(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  // attach event listeners
  useEffect(() => {
    if (!marker) return;

    for (const [eventName, handlerName] of events) {
      const handler = props[handlerName];
      if (handler) {
        const listener = marker.addListener(eventName, handler);
        listeners.current.set(eventName, listener);
      }
    }

    return () => {
      for (const [_, listener] of listeners.current.entries()) {
        listener.remove();
      }
      listeners.current.clear();
    };
    // ESLint cannot statically detect the dependencies here
    // The marker dependency is very important to make sure event handlers are attached upon initialization
  }, [marker, onAnimationChange, onClick, onClickableChange, onContextMenu, onCursorChange, onDoubleClick, onDrag, onDragEnd, onDrag, onDragEnd, onDragStart, onDraggableChange, onFlatChange, onIconChange, onMouseDown, onMouseOver, onMouseOut, onMouseUp, onPositionChange, onShapeChange, onTitleChange, onVisibleChange, onZIndexChange]);

  // `google.maps.Map` manages the DOM manipulation
  return null;
};

export default Marker;

const events = [
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

type MapMouseEvent = google.maps.MapMouseEvent;

type MarkerProps = google.maps.MarkerOptions & MarkerEventHandlers;

// === Compile-time check that we have the exact same handler names in the `events` array and the `MarkerEventHandlers` type ===
// (note: this is an isomorphism proof)
type Events = typeof events;
type EventName = Events[number][0];
type EventHandlerName = Events[number][1];

// These two functions are the proof
function _handlersIsomorphismForward(handler: EventHandlerName): keyof MarkerEventHandlers {
  return handler;
}

function _handlersIsomorphismBackward(handler: keyof MarkerEventHandlers): EventHandlerName {
  return handler;
}
