import React, { useState } from 'react';
import {
 DrawerToolEnum, Image, LinearRing, PointEnum, Position, Track,
} from 'types';
import { Toolbar, TracksImage } from 'components';
import { QuarkArray, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';

interface DrawerProps {
    image: Image,
    tracks: QuarkArray<Track>,
    selectedTrack: SelectQuarkNullable<Track>,
    onValidate: () => void,
}

export const Drawer: React.FC<DrawerProps> = watchDependencies((props: DrawerProps) => {
  console.log("Rendering Drawer");
    const [selectedTool, setSelectedTool] = useState<DrawerToolEnum>('LINE_DRAWER');
    const [displayOtherTracks, setDisplayOtherTracks] = useState(false);

    const selectedTrack = props.selectedTrack()!;

    const addPointToLine = (pos: Position) => {
      const newLineQuark = selectedTrack.lines.quarkAt(0);
      const newLine = newLineQuark();
      switch (selectedTool) {
        case 'LINE_DRAWER':
          const newPoints = newLine.points || [];
          newPoints.push(pos);
          newLineQuark.set({
            ...newLine,
            points: newPoints
          });
          break;
        case 'HAND_DEPARTURE_DRAWER':
          const newHandPoints = newLine.handDepartures || [];
          if (newHandPoints.length < 2) newHandPoints.push(pos);
          else { newHandPoints.splice(0,1); newHandPoints.push(pos); }
          newLineQuark.set({
            ...newLine,
            handDepartures: newHandPoints
          });
          break;
          case 'FOOT_DEPARTURE_DRAWER':
            const newFootPoints = newLine.feetDepartures || [];
            if (newFootPoints.length < 2) newFootPoints.push(pos);
            else { newFootPoints.splice(0,1); newFootPoints.push(pos); }
            newLineQuark.set({
              ...newLine,
              feetDepartures: newFootPoints
            });
            break;
          case 'FORBIDDEN_AREA_DRAWER':
            const newForbiddenPoints = newLine.forbidden || [];
            newForbiddenPoints.push(constructArea(pos));
            newLineQuark.set({
              ...newLine,
              forbidden: newForbiddenPoints
            });
            break;
      }
    }

    const deletePointToLine = (pointType: PointEnum, index: number) => {
      const key = pointType === 'LINE_POINT' ? 'points' :
        pointType === 'HAND_DEPARTURE_POINT' ? 'handDepartures' :
        pointType === 'FOOT_DEPARTURE_POINT' ? 'feetDepartures' :
        'forbidden'
      const newLine = selectedTrack.lines.quarkAt(0);
      const newProps = {...newLine()};
      newProps[key]?.slice(index, 1);
      newLine.set(newProps);
    }

    const constructArea = (pos: Position): LinearRing => {
      const size = 150;
      return {
        0: [pos[0]-size, pos[1]-size],
        1: [pos[0]-size, pos[1]+size],
        2: [pos[0]+size, pos[1]+size],
        3: [pos[0]+size, pos[1]-size],
      }
    }

    return (
      <div className="absolute top-0 bg-black bg-opacity-90 h-full flex flex-col z-500 w-full md:w-[calc(100%-600px)]">

        <div className="flex-1 flex items-center relative">
          {/* TODO: CHANGE SIZING */}
          <TracksImage
            image={props.image}
            tracks={displayOtherTracks ? props.tracks : new QuarkArray([selectedTrack])}
            selectedTrack={props.selectedTrack}
            currentTool={selectedTool}
            editable
            displayTracksDetails
            onImageClick={(pos) => addPointToLine(pos)}
            onPointClick={(pointType, index) => {
              if (selectedTool === 'ERASER') deletePointToLine(pointType, index);
            }}
            onAreaChange={(areaType, index, area) => {

            }}
          />
        </div>

        <Toolbar
          selectedTool={selectedTool}
          displayOtherTracks={displayOtherTracks}
          grade={selectedTrack.grade}
          onToolSelect={(tool) => setSelectedTool(tool)}
          onGradeSelect={(grade) => {
            props.selectedTrack.quark()?.set({
              ...selectedTrack,
              grade: grade,
            })
          }}
          onClear={() => {}}
          onRewind={() => {}}
          onOtherTracks={() => setDisplayOtherTracks(!displayOtherTracks)}
          onValidate={props.onValidate}
        />

      </div>
    );
});

Drawer.displayName = "Drawer";