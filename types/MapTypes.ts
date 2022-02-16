import { UUID } from "./Utils";

export type MapProps =
  MapEventHandlers
  & google.maps.MapOptions
  & {
    className?: string,
  };

export interface MarkerProps {
  id: UUID,
  options?: Omit<google.maps.MarkerOptions, 'map'>,
  handlers?: MarkerEventHandlers
};

export type MapMouseEvent = google.maps.MapMouseEvent;
export type IconMouseEvent = google.maps.IconMouseEvent;

export type MapEventHandlers = {
  onBoundsChange?: () => void,
  onCenterChange?: () => void,
  onClick?: (event: MapMouseEvent | IconMouseEvent) => void,
  onContextMenu?: (event: MapMouseEvent) => void,
  onDoubleClick?: (event: MapMouseEvent) => void,
  onDrag?: () => void,
  onDragEnd?: () => void,
  onDragStart?: () => void,
  onHeadingChange?: () => void,
  onLoad?: (map: google.maps.Map) => void,
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

export type MarkerEventHandlers = {
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


// === Map events ===
export const mapEvents = [
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

// Compile-time check that we have the exact same handler names
// in the`events` array and the `MapEventHandlers` type.
// (this is an isomorphism proof)
// These two functions are the proof.
function _handlersIsomorphismForward(handler: EventHandlerName): keyof MapEventHandlers {
  return handler;
}

// function _handlersIsomorphismBackward(handler: keyof MapEventHandlers): EventHandlerName {
//   return handler;
// }

// === Marker events ==
export const markerEvents = [
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

type MarkerEvents = typeof markerEvents;
type MarkerEventName = MarkerEvents[number][0];
type MarkerEventHandlerName = MarkerEvents[number][1];

// Compile-time check that we have the exact same handler names
// in the`events` array and the `MapEventHandlers` type.
// (this is an isomorphism proof)
// These two functions are the proof.
function _markerHandlersIsomorphismForward(handler: MarkerEventHandlerName): keyof MarkerEventHandlers {
  return handler;
}

function _markerHandlersIsomorphismBackward(handler: keyof MarkerEventHandlers): MarkerEventHandlerName {
  return handler;
}