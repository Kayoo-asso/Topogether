import { getCoordsInViewbox, pointsToPolylineStr } from "helpers/svg";
import React, { useState } from "react";
import { Position } from "types";

interface DraggablePolylineProps {
	id?: string;
	points: Position[];
	className?: string;
	strokeWidth?: number;
	pointer?: boolean;
	vb: React.RefObject<SVGRectElement | null>;
	onDragStart?: () => void;
	onDrag?: (diffX: number, diffY: number) => void;
	onClick?: () => void;
}

export const DraggablePolyline: React.FC<DraggablePolylineProps> = ({
	className = "stroke-main",
	strokeWidth = 2,
	pointer = true,
	...props
}: DraggablePolylineProps) => {
	const [cursorPosition, setCursorPosition] = useState({
		x: 0,
		y: 0,
		active: false,
	});

	const handleMouseDown: React.PointerEventHandler<SVGPolylineElement> = (
		e: React.PointerEvent
	) => {
		if (props.vb.current) {
			e.preventDefault();
			e.stopPropagation();
			const coords = getCoordsInViewbox(props.vb.current, e.clientX, e.clientY);
			if (coords) {
				setCursorPosition({
					x: coords[0],
					y: coords[1],
					active: true,
				});
				if (props.onDragStart) props.onDragStart();
			}
		}
	};
	const handleMouseMove: React.PointerEventHandler<SVGPolylineElement> = (
		e: React.PointerEvent
	) => {
		if (props.vb.current && props.onDrag && cursorPosition.active) {
			e.preventDefault();
			e.stopPropagation();
			const coords = getCoordsInViewbox(props.vb.current, e.clientX, e.clientY);
			if (coords) {
				const diffX = coords[0] - cursorPosition.x;
				const diffY = coords[1] - cursorPosition.y;
				props.onDrag(diffX, diffY);
				setCursorPosition({
					...cursorPosition,
					x: coords[0],
					y: coords[1],
				});
			}
		}
	};
	const handleMouseUp: React.PointerEventHandler<SVGPolylineElement> = (
		e: React.PointerEvent
	) => {
		if (cursorPosition.active) {
			e.preventDefault();
			e.stopPropagation();
			setCursorPosition({
				...cursorPosition,
				active: false,
			});
		}
	};

	return (
		<polyline
			id={props.id}
			className={`${cursorPosition.active ? "z-50" : "z-20"} ${
				pointer ? "cursor-pointer " : ""
			}${className}`}
			points={pointsToPolylineStr(props.points)}
			strokeWidth={strokeWidth}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseDownCapture={props.onClick}
		/>
	);
};
