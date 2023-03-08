import React, { useState } from "react";
import { getCoordsInViewbox, getPathFromPoints } from "helpers/svg";
import { Quark, watchDependencies } from "helpers/quarky";
import { Grade, gradeToLightGrade, Line } from "types";
import { SVGPoint } from "./SVGPoint";
import { getFillGradeColorClass, getStrokeGradeColorClass } from "helpers/gradeColors";

interface SVGLineProps {
	line: Quark<Line>;
	grade: Grade | undefined;
	editable?: boolean;
	vb: React.RefObject<SVGRectElement | null>;
	linePointSize: number;
	eraser?: boolean;
	displayTrackOrderIndex?: boolean;
	trackWeight?: number;
	trackOrderIndex: number;
	phantom?: boolean;
	onClick?: () => void;
	onPointClick?: (index: number) => void;
}

export const SVGLine: React.FC<SVGLineProps> = watchDependencies(
	({
		editable = false,
		eraser = false,
		phantom = false,
		displayTrackOrderIndex = true,
		trackWeight = 2,
		...props
	}: SVGLineProps) => {
		const line = props.line();
		const points = line.points;
		const path = getPathFromPoints(points, "CURVE");
		const firstPointSize = props.linePointSize / 1.2;
		const firstX = points.length > 0 ? points[0][0] : null;
		const firstY = points.length > 0 ? points[0][1] : null;

		const [originPosition, setOriginPosition] = useState({
			active: false,
			offsetX: 0,
			offsetY: 0,
		});

		const handlePointerDown: React.PointerEventHandler<
			SVGCircleElement | SVGTextElement
		> = (e: React.PointerEvent) => {
			if (editable && props.vb.current && firstX !== null && firstY !== null) {
				e.preventDefault();
				e.stopPropagation();
				const el = e.currentTarget;
				el.setPointerCapture(e.pointerId);
				const coords = getCoordsInViewbox(
					props.vb.current,
					e.clientX,
					e.clientY
				);
				if (coords) {
					setOriginPosition({
						...originPosition,
						active: true,
						offsetX: coords[0] - firstX,
						offsetY: coords[1] - firstY,
					});
				}
			}
		};
		const handlePointerMove: React.PointerEventHandler<
			SVGCircleElement | SVGTextElement
		> = (e: React.PointerEvent) => {
			if (originPosition.active && props.vb.current && editable) {
				e.preventDefault();
				e.stopPropagation();
				const coords = getCoordsInViewbox(
					props.vb.current,
					e.clientX,
					e.clientY
				);
				if (coords) {
					const newX = coords[0] - originPosition.offsetX;
					const newY = coords[1] - originPosition.offsetY;
					const newPoints = [...line.points];
					newPoints[0] = [newX, newY];
					props.line.set({
						...line,
						points: newPoints,
					});
				}
			}
		};
		const handlePointerUp: React.PointerEventHandler<
			SVGCircleElement | SVGTextElement
		> = (e: React.PointerEvent) => {
			if (originPosition.active) {
				e.preventDefault();
				e.stopPropagation();
				setOriginPosition({
					offsetX: 0,
					offsetY: 0,
					active: false,
				});
			}
		};

		const getColorNumber = () => {
			return props.grade ? gradeToLightGrade(props.grade) : "grey";
		};

		return (
			<>
				<path
					className={`fill-[none] ${getStrokeGradeColorClass(props.grade)} ${
						phantom ? "z-10" : "z-30"
					}${props.onClick ? " md:cursor-pointer" : ""}`}
					d={path}
					strokeDasharray={phantom ? 100 : ''}
					onClick={props.onClick}
					style={{
						strokeWidth: trackWeight + "px",
					}}
				/>

				{editable && (
					<>
						{points.map((p, index) => (
							<SVGPoint
								key={index}
								iconHref={`/assets/icons/colored/line-point/_line-point-${getColorNumber()}.svg`}
								x={p[0] - props.linePointSize / 2}
								y={p[1] - props.linePointSize / 2}
								size={props.linePointSize}
								draggable={editable}
								vb={props.vb}
								eraser={eraser}
								onDrag={(pos) => {
									if (editable) {
										const newPoints = [...line.points];
										newPoints[index] = [pos[0], pos[1]];
										props.line.set({
											...line,
											points: newPoints,
										});
									}
								}}
								onClick={(e) => {
									if (eraser) e.stopPropagation();
									props.onPointClick && props.onPointClick(index);
								}}
							/>
						))}
						;
					</>
				)}

				{displayTrackOrderIndex && firstX !== null && firstY !== null && (
					<>
						<circle
							cx={firstX}
							cy={firstY}
							r={firstPointSize}
							className={`${getFillGradeColorClass(props.grade)} ${
								phantom ? "z-20" : "z-40"
							}${
								((!eraser && props.onClick) || phantom) ? " md:cursor-pointer" : ""
							}`}
							onClick={(e) => {
								if (eraser) {
									e.stopPropagation();
									props.onPointClick && props.onPointClick(0);
								} else if (props.onClick) props.onClick();
							}}
							onPointerDown={handlePointerDown}
							onPointerUp={handlePointerUp}
							onPointerMove={handlePointerMove}
						/>
						<text
							x={firstX}
							y={firstY}
							className={`select-none fill-white ${
								phantom ? "z-20" : "z-40"
							}${
								((!eraser && props.onClick) || phantom) ? " md:cursor-pointer" : ""
							}`}
							textAnchor="middle"
							stroke="white"
							fontSize={firstPointSize + "px"}
							dy={firstPointSize / 3 + "px"}
							onClick={(e) => {
								if (eraser) {
									e.stopPropagation();
									props.onPointClick && props.onPointClick(0);
								} else if (props.onClick) props.onClick();
							}}
							onPointerDown={handlePointerDown}
							onPointerUp={handlePointerUp}
							onPointerMove={handlePointerMove}
						>
							{props.trackOrderIndex + 1}
						</text>
					</>
				)}
			</>
		);
	}
);

SVGLine.displayName = "SVGLine";
