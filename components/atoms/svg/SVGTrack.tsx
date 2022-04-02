import React, { useState } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import { DrawerToolEnum, gradeToLightGrade, Line, PointEnum, Track, UUID } from 'types';
import { SVGArea, SVGLine, SVGPoint } from '.';

interface SVGTrackProps {
    track: Quark<Track>,
    editable?: boolean,
    vb?: SVGRectElement | null,
    vbWidth?: number,
    vbHeight?: number,
    highlighted?: boolean,
    currentTool?: DrawerToolEnum,
    imageId: UUID,
    displayTrackDetails?: boolean,
    displayTrackOrderIndexes?: boolean
    trackWeight?: number,
    onPointClick?: (pointType: PointEnum, index: number) => void,
    onLineClick?: () => void,
}

export const SVGTrack: React.FC<SVGTrackProps> = watchDependencies(({
    editable = false,
    highlighted = true,
    displayTrackDetails = false,
    displayTrackOrderIndexes = true,
    trackWeight = 2,
    ...props
}: SVGTrackProps) => {
    const track = props.track();
    const [SVGUseId, setSVGUseId] = useState<string>();
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
                editable={editable && highlighted}
                vb={props.vb}
                vbWidth={props.vbWidth}
                vbHeight={props.vbHeight}
                eraser={props.currentTool === 'ERASER'}
                grade={track.grade}
                phantom={!highlighted}
                trackOrderIndex={track.index}
                trackWeight={trackWeight}
                displayTrackOrderIndex={displayTrackOrderIndexes}
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
                        x={handX}
                        y={handY}
                        draggable={editable}
                        vb={props.vb}
                        vbWidth={props.vbWidth}
                        vbHeight={props.vbHeight}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    hand1: pos,
                                });
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
                        x={handX}
                        y={handY}
                        draggable={editable}
                        vb={props.vb}
                        vbWidth={props.vbWidth}
                        vbHeight={props.vbHeight}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    hand2: pos,
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
                        x={footX}
                        y={footY}
                        size={450}
                        draggable={editable}
                        vb={props.vb}
                        vbWidth={props.vbWidth}
                        vbHeight={props.vbHeight}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    foot1: pos,
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
                        x={footX}
                        y={footY}
                        size={450}
                        draggable={editable}
                        vb={props.vb}
                        vbWidth={props.vbWidth}
                        vbHeight={props.vbHeight}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                                quarkLine?.set({
                                    ...line,
                                    foot2: pos,
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
                const id = 'area' + i;
                nodes.push(
                    <SVGArea
                        key={id}
                        id={id}
                        area={area}
                        editable={editable}
                        vb={props.vb}
                        vbWidth={props.vbWidth}
                        vbHeight={props.vbHeight}
                        eraser={props.currentTool === 'ERASER'}
                        onDragStart={() => {
                            const area = document.querySelector('polyline#'+id);
                            if (area) {
                                const parent = area.parentNode;
                                if (parent) {
                                    parent.removeChild(area);
                                    parent.append(area);
                                }
                            }
                        }}
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

        if (false) {
            nodes.push(
                <use xlinkHref={'#area0'} />
            )
        }
        return nodes;
    }

    return <>
        {track.lines.quarks().map(constructNodes)}
    </>
});

SVGTrack.displayName = "SVGTrack";