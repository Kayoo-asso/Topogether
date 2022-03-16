import React from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import { DrawerToolEnum, gradeToLightGrade, Line, PointEnum, Track, UUID } from 'types';
import { SVGArea, SVGLine, SVGPoint } from '.';

interface SVGTrackProps {
    track: Quark<Track>,
    r: number,
    editable?: boolean,
    highlighted?: boolean,
    currentTool?: DrawerToolEnum,
    imageId: UUID,
    displayTrackDetails?: boolean,
    onPointClick?: (pointType: PointEnum, index: number) => void,
    onLineClick?: () => void,
}

export const SVGTrack: React.FC<SVGTrackProps> = watchDependencies(({
    editable = false,
    highlighted = true,
    displayTrackDetails = false,
    ...props
}: SVGTrackProps) => {
    const track = props.track();
    const colorNumber = track.grade ? gradeToLightGrade(track.grade) : 'grey';

    const constructNodes = (quarkLine: Quark<Line>) => {
        const line = quarkLine();
        if (line.imageId !== props.imageId) return null;
        const nodes: JSX.Element[] = [];

        // Line
        nodes.push(
            <SVGLine
                key={"line"}
                line={quarkLine}
                r={props.r}
                editable={editable && highlighted}
                eraser={props.currentTool === 'ERASER'}
                grade={track.grade}
                pointSize={8}
                phantom={!highlighted}
                trackOrderIndex={track.index}
                onClick={props.onLineClick}
                onPointClick={(index) => props.onPointClick && props.onPointClick('LINE_POINT', index)}
            />
        )
       
        if (displayTrackDetails && highlighted) {
            // Hands departure
            if (line.hand1) {
                const [handX, handY] = line.hand1;
                nodes.push(
                    <SVGPoint
                        key={'hand1'}
                        iconHref={`/assets/icons/colored/hand-full/_hand-full-${colorNumber}.svg`}
                        x={handX * props.r}
                        y={handY * props.r}
                        draggable={editable}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    hand1: [pos[0] / props.r, pos[1] / props.r],
                                })
                            }
                        }}
                        onClick={() => props.onPointClick && props.onPointClick('HAND_DEPARTURE_POINT', -1)}
                    />
                );
            }
            if (line.hand2) {
                const [handX, handY] = line.hand2;
                nodes.push(
                    <SVGPoint
                        key={'hand2'}
                        iconHref={`/assets/icons/colored/hand-full/_hand-full-${colorNumber}.svg`}
                        x={handX * props.r}
                        y={handY * props.r}
                        draggable={editable}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    hand2: [pos[0] / props.r, pos[1] / props.r],
                                })
                            }
                        }}
                        onClick={() => props.onPointClick && props.onPointClick('HAND_DEPARTURE_POINT', 0)}
                    />
                );
            }

            // Feet departure
            if (line.foot1) {
                const [footX, footY] = line.foot1;
                nodes.push(
                    <SVGPoint
                        key={'foot1'}
                        iconHref={`/assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${colorNumber}.svg`}
                        x={footX * props.r}
                        y={footY * props.r}
                        draggable={editable}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    foot1: [pos[0] / props.r, pos[1] / props.r],
                                })
                            }
                        }}
                        onClick={() => props.onPointClick && props.onPointClick('FOOT_DEPARTURE_POINT', 0)}
                    />
                );
            }
            if (line.foot2) {
                const [footX, footY] = line.foot2;
                nodes.push(
                    <SVGPoint
                        key={'foot2'}
                        iconHref={`/assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${colorNumber}.svg`}
                        x={footX * props.r}
                        y={footY * props.r}
                        draggable={editable}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    foot2: [pos[0] / props.r, pos[1] / props.r],
                                })
                            }
                        }}
                        onClick={() => props.onPointClick && props.onPointClick('FOOT_DEPARTURE_POINT', -1)}
                    />
                );
            }
        }

        // Forbidden areas
        if (displayTrackDetails && highlighted && line.forbidden) {
            for (let i = 0; i < line.forbidden.length; i++) {
                const area = line.forbidden[i];
                nodes.push(
                    <SVGArea
                        key={'area' + i}
                        area={area}
                        editable={editable}
                        eraser={props.currentTool === 'ERASER'}
                        rx={props.r}
                        ry={props.r}
                        pointSize={8}
                        onChange={(area) => {
                            if (editable) {
                                const newForbiddens = [...line.forbidden!]
                                newForbiddens[i] = area;
                                quarkLine?.set({
                                    ...line,
                                    forbidden: newForbiddens,
                                })
                            }
                        }}
                        onClick={() => props.onPointClick && props.onPointClick('FORBIDDEN_AREA_POINT', i)}
                    />,
                );
            }
        }
        return nodes;
    }

    return <>
        {track.lines.quarks().map(constructNodes)}
    </>
});

SVGTrack.displayName = "SVGTrack";