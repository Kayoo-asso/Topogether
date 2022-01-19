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
        if (line.imageId !== props.imageId) return;
        const nodes: JSX.Element[] = [];

        // Line
        nodes.push(
            <SVGLine
                line={quarkLine}
                r={props.r}
                editable={editable && highlighted}
                eraser={props.currentTool === 'ERASER'}
                grade={track.grade}
                pointSize={8}
                phantom={!highlighted}
                trackOrderIndex={track.orderIndex}
                onClick={props.onLineClick}
                onPointClick={(index) => props.onPointClick && props.onPointClick('LINE_POINT', index)}
            />
        )
    
        // Hand and feet departures
        if (displayTrackDetails && highlighted) {
            if (line.handDepartures) {
                for (let i = 0; i < line.handDepartures.length; i++) {
                const [handX, handY] = line.handDepartures[i];
                nodes.push(
                    <SVGPoint 
                        key={'hand'+i}
                        iconHref={`/assets/icons/colored/hand-full/_hand-full-${colorNumber}.svg`}
                        x={handX * props.r}
                        y={handY * props.r}
                        draggable={editable}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                            const newHands = [...line.handDepartures!]
                            newHands[i] = [pos[0]/props.r, pos[1]/props.r];
                            quarkLine?.set({
                                ...line,
                                handDepartures: newHands,
                            })
                            }
                        }}
                        onClick={() => props.onPointClick && props.onPointClick('HAND_DEPARTURE_POINT', i)}
                    />
                );
                }
            }
            if (line.feetDepartures) {
                for (let i = 0; i < line.feetDepartures.length; i++) {
                const [footX, footY] = line.feetDepartures[i];
                nodes.push(
                    <SVGPoint 
                        key={'foot'+i}
                        iconHref={`/assets/icons/colored/climbing-shoe-full/_climbing-shoe-full-${colorNumber}.svg`}
                        x={footX * props.r}
                        y={footY * props.r}
                        draggable={editable}
                        eraser={props.currentTool === 'ERASER'}
                        onDrag={(pos) => {
                            if (editable) {
                            const newFeet = [...line.feetDepartures!]
                            newFeet[i] = [pos[0]/props.r, pos[1]/props.r];
                            quarkLine?.set({
                                ...line,
                                feetDepartures: newFeet,
                            })
                            }
                        }}
                        onClick={() => props.onPointClick && props.onPointClick('FOOT_DEPARTURE_POINT', i)}
                    />
                );
                }
            }
        }

        // Forbidden areas
        if (displayTrackDetails && highlighted && line.forbidden) {
            for (let i = 0; i < line.forbidden.length; i++) {
                const area = line.forbidden[i];
                nodes.push(
                    <SVGArea
                        key={'area'+i}
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
    constructNodes(track.lines.quarkAt(0));

    return (
        <>
            {track.lines.quarks().map(quarkLine => {
                const nodes = constructNodes(quarkLine);
                return nodes?.map(n => n);   
            })}
        </>
    )
});