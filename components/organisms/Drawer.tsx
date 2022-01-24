import React, { useEffect, useState } from 'react';
import {
  DrawerToolEnum, Image, LinearRing, PointEnum, Position, Track,
} from 'types';
import { ModalDelete, Toolbar, TracksImage } from 'components';
import { QuarkArray, SelectQuarkNullable, useCreateQuark, watchDependencies } from 'helpers/quarky';
import { v4 } from 'uuid';

interface DrawerProps {
  image: Image,
  tracks: QuarkArray<Track>,
  selectedTrack: SelectQuarkNullable<Track>,
  onValidate: () => void,
}

export const Drawer: React.FC<DrawerProps> = watchDependencies((props: DrawerProps) => {
  const [selectedTool, setSelectedTool] = useState<DrawerToolEnum>('LINE_DRAWER');
  const [displayOtherTracks, setDisplayOtherTracks] = useState(false);
  const [displayClearModal, setDisplayClearModal] = useState(false);

  const selectedTrack = props.selectedTrack()!;

  const addPointToLine = (pos: Position) => {
    let newLineQuark = selectedTrack.lines.findQuark(l => l.imageId === props.image.id);
    if (!newLineQuark) {
      selectedTrack.lines.push({
        id: v4(),
        imageId: props.image.id,
        points: [],
      });
      newLineQuark = selectedTrack.lines.findQuark(l => l.imageId === props.image.id)!;
    }

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
        else { newHandPoints.splice(0, 1); newHandPoints.push(pos); }
        newLineQuark.set({
          ...newLine,
          handDepartures: newHandPoints
        });
        break;
      case 'FOOT_DEPARTURE_DRAWER':
        const newFootPoints = newLine.feetDepartures || [];
        if (newFootPoints.length < 2) newFootPoints.push(pos);
        else { newFootPoints.splice(0, 1); newFootPoints.push(pos); }
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
          'forbidden';
    const newLine = selectedTrack.lines.quarkAt(0);
    const line = newLine();
    const points = line[key]!;
    newLine.set({
      ...line,
      [key]: index === -1 ? [...points.slice(0, -1)] : [...points.slice(0, index), ...points.slice(index + 1)]
    });
  }
  const rewind = () => {
    const pointType: PointEnum | undefined = selectedTool === 'LINE_DRAWER' ? 'LINE_POINT' :
      selectedTool === 'FOOT_DEPARTURE_DRAWER' ? 'FOOT_DEPARTURE_POINT' :
        selectedTool === 'HAND_DEPARTURE_DRAWER' ? 'HAND_DEPARTURE_POINT' :
          selectedTool === 'FORBIDDEN_AREA_DRAWER' ? 'FORBIDDEN_AREA_POINT' :
            undefined;
    if (pointType) deletePointToLine(pointType, -1)
  }

  const constructArea = (pos: Position): LinearRing => {
    const size = 150;
    return [
      [pos[0] - size, pos[1] - size],
      [pos[0] - size, pos[1] + size],
      [pos[0] + size, pos[1] + size],
      [pos[0] + size, pos[1] - size],
    ]
  }

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (event.ctrlKey && event.key === 'z') rewind();
    });
  }, []);

  return (
    <>
      <div className="absolute top-0 bg-black bg-opacity-90 h-full flex flex-col z-1000 w-full md:w-[calc(100%-600px)]">

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
          onClear={() => setDisplayClearModal(true)}
          onRewind={rewind}
          onOtherTracks={() => setDisplayOtherTracks(!displayOtherTracks)}
          onValidate={props.onValidate}
        />

      </div>

      {displayClearModal &&
        <ModalDelete
          onClose={() => setDisplayClearModal(false)}
          onDelete={() => {
            setDisplayClearModal(false);
            const newLines = selectedTrack.lines;
            newLines.shift();
            props.selectedTrack.quark()!.set({
              ...selectedTrack,
              lines: newLines
            });
          }}
        >
          Vous êtes sur le point de supprimer l'ensemble du tracé. Voulez-vous continuer ?
        </ModalDelete>
      }
    </>
  );
});

Drawer.displayName = "Drawer";