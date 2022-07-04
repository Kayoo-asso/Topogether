import React from "react";
import { defaultTracksWeight } from "components/molecules";
import { LinearRing, Position } from "types";
import { DraggablePolyline } from ".";
import { pointsToPolylineStr } from "helpers/svg";
import { SVGPoint } from "./SVGPoint";

interface SVGAreaProps {
	// a LinearRing delineates the contour of a Polygon
	area: Position[];
	id?: string;
	editable?: boolean;
	vb: React.RefObject<SVGRectElement | null>;
	eraser?: boolean;
	pointSize?: number;
	className?: string;
	onDragStart?: () => void;
	onChange?: (area: Position[]) => void;
	onClick?: () => void;
}

// TODO : allow areas other than a rectangle
export const SVGArea: React.FC<SVGAreaProps> = ({
	editable = false,
	eraser = false,
	pointSize = defaultTracksWeight * 4,
	className = "",
	...props
}: SVGAreaProps) => {
	const points = props.area;
	const extendPoints = [...props.area];
	extendPoints.push(points[0]);

	const updateAreaPoint = (index: 0 | 1 | 2 | 3, newPos: Position) => {
		if (props.onChange) {
			const newArea = [...props.area];
			newArea[index] = [newPos[0], newPos[1]];
			props.onChange(newArea);
		}
	};

	const dragAllPoints = (diffX: number, diffY: number) => {
		if (props.onChange) {
			const newArea: LinearRing = [
				[props.area[0][0] + diffX, props.area[0][1] + diffY],
				[props.area[1][0] + diffX, props.area[1][1] + diffY],
				[props.area[2][0] + diffX, props.area[2][1] + diffY],
				[props.area[3][0] + diffX, props.area[3][1] + diffY],
			];
			props.onChange(newArea);
		}
	};

	const renderPolyline = () => {
		if (editable) {
			return (
				<DraggablePolyline
					id={props.id}
					className={`fill-second/10 stroke-second ${
						eraser ? "hover:fill-second/50" : ""
					} ${className}`}
					strokeWidth={defaultTracksWeight}
					points={extendPoints}
					pointer={!eraser}
					vb={props.vb}
					onDragStart={props.onDragStart}
					onDrag={(diffX, diffY) => {
						dragAllPoints(diffX, diffY);
					}}
					onClick={props.onClick}
				/>
			);
		}

		return (
			<polyline
				className={`z-20 fill-second/10 stroke-second ${className}`}
				points={pointsToPolylineStr(extendPoints)}
				strokeWidth={defaultTracksWeight}
			/>
		);
	};

	const renderPoints = () => {
		return extendPoints.map((point, index) => (
			<SVGPoint
				key={index}
				x={point[0] - pointSize / 2}
				y={point[1] - pointSize / 2}
				iconHref="/assets/icons/colored/line-point/_line-point-second.svg"
				draggable={editable}
				vb={props.vb}
				size={pointSize}
				className="fill-second"
				onDrag={(pos) => {
					const idx = index < 4 ? index : 0;
					updateAreaPoint(idx as 0 | 1 | 2 | 3, pos);
				}}
			/>
		));
	};

	return (
		<>
			{renderPolyline()}
			{renderPoints()}
		</>
	);
};
