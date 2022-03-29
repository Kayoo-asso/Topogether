import React, { useEffect, useState } from 'react';
import {
  DrawerToolEnum, Image, LinearRing, PointEnum, Position, Track,
} from 'types';
import { ModalDelete, Toolbar, TracksImage } from 'components';
import { QuarkArray, QuarkIter, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
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

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') rewind();
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const selectedTrack = props.selectedTrack()!;

  const addPointToLine = (pos: Position) => {
    let newLineQuark = selectedTrack.lines.findQuark(l => l.imageId === props.image.id);
    if (!newLineQuark) {
      selectedTrack.lines.push({
        id: v4(),
        index: selectedTrack.lines.length,
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
        newLineQuark.set({
          ...newLine,
          hand1: newLine.hand2,
          hand2: pos
        });
        break;
      case 'FOOT_DEPARTURE_DRAWER':
        newLineQuark.set({
          ...newLine,
          foot1: newLine.foot2,
          foot2: pos
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
    const newLine = selectedTrack.lines.quarkAt(0);
    const line = newLine();
    switch (pointType) {
      case 'LINE_POINT':
        newLine.set({
          ...line,
          points: [...line.points.slice(0, index), ...line.points.slice(index + 1)]
        }); break;
      case 'HAND_DEPARTURE_POINT':
        newLine.set({
          ...line,
          hand1: index === 0 ? undefined : line.hand1,
          hand2: index === 1 || index === -1 ? undefined : line.hand2
        }); break;
      case 'FOOT_DEPARTURE_POINT':
        newLine.set({
          ...line,
          foot1: index === 0 ? undefined : line.foot1,
          foot2: index === 1 || index === -1 ? undefined : line.foot2
        }); break;
      case 'FORBIDDEN_AREA_POINT':
        if (line.forbidden) {
          newLine.set({
            ...line,
            forbidden: [...line.forbidden.slice(0, index), ...line.forbidden.slice(index + 1)]
          });
        } break;
    }
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

  return (
    <>
      {/* Here we position absolutely, using hardcoded 7vh for the header
          TODO: encode the size of header / toolbar / etc... as units Tailwind config?
      */}
      <div className="absolute left-0 top-[7vh] h-content md:h-contentPlusShell w-full md:w-[calc(100%-600px)] z-1000">

        {/* Same, we know absolute size, since both header + toolbar are 7vh each */}
        <div className="h-[86vh] bg-black b-opacity-90">
          <TracksImage
            sizeHint='100vw'
            image={props.image}
            tracks={displayOtherTracks ? props.tracks.quarks() : new QuarkIter([props.selectedTrack.quark()!])}
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