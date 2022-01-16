import React, { useState } from 'react';
import {
 DrawerToolEnum, Image, Track,
} from 'types';
import { Toolbar, TracksImage } from 'components';
import { QuarkArray, SelectQuarkNullable } from 'helpers/quarky';

interface DrawerProps {
    image: Image,
    tracks: QuarkArray<Track>,
    selectedTrack: SelectQuarkNullable<Track>,
    onValidate: () => void,
}

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [selectedTool, setSelectedTool] = useState<DrawerToolEnum>('LINE_DRAWER');
    const [displayOtherTracks, setDisplayOtherTracks] = useState(false);

    return (
      <div className="absolute top-0 bg-black bg-opacity-90 h-full flex flex-col z-500 w-full md:w-[calc(100%-600px)]">

        <div className="flex-1 flex items-center relative">
          {/* TODO: CHANGE SIZING */}
          <TracksImage
            image={props.image}
            tracks={displayOtherTracks ? props.tracks : new QuarkArray([props.selectedTrack()!])}
            selectedTrack={props.selectedTrack}
            currentTool={selectedTool}
            onPolylineClick={displayOtherTracks ? (line) => {
              console.log(line);
            } : undefined}
          />
        </div>

        <Toolbar
          selectedTool={selectedTool}
          displayOtherTracks={displayOtherTracks}
          grade={props.selectedTrack()!.grade}
          onToolSelect={(tool) => setSelectedTool(tool)}
          onGradeSelect={(grade) => {
            props.selectedTrack.quark()?.set({
              ...props.selectedTrack()!,
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
};
