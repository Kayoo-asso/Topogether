import React, { useState } from 'react';
import { DrawerToolEnum, Image, Track, UUID } from 'types';
import { isMobile } from 'react-device-detect';
import { Toolbar, TracksImage } from 'components';
import { Quark, QuarkIter } from 'helpers/quarky';


interface DrawerProps {
    image: Image,
    tracks: QuarkIter<Track>,
    displayedTrackId: UUID,
    onValidate: () => void,
}

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [selectedTool, setSelectedTool] = useState<DrawerToolEnum>('LINE_DRAWER');
    const [displayOtherTracks, setDisplayOtherTracks] = useState(false);

    const track = props.tracks
        .find(x => x.id === props.displayedTrackId)();

    return (
        <div className='absolute top-0 bg-black bg-opacity-90 h-full flex flex-col z-500 w-full md:w-[calc(100%-600px)]'>

            <div className='flex-1 flex items-center relative'>
                {/* TODO: CHANGE SIZING */}
               <TracksImage 
                    image={props.image}
                    tracks={props.tracks}
                    currentTrackId={props.displayedTrackId}
                    containerClassName='w-full'
               /> 
            </div>

            <Toolbar
                selectedTool={selectedTool}
                displayOtherTracks={displayOtherTracks}
                grade={track!.grade}
                onToolSelect={(tool) => setSelectedTool(tool)}
                onGradeSelect={(grade) => console.log(grade)}
                onClear={() => {}}
                onRewind={() => {}}
                onOtherTracks={() => setDisplayOtherTracks(!displayOtherTracks)}
                onValidate={props.onValidate}
            />

        </div>
    )
}