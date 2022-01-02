import React, { useState } from 'react';
import { DrawerToolEnum, Image, Track, UUID } from 'types';
import { isMobile } from 'react-device-detect';
import { Toolbar, TracksImage } from 'components';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';


interface DrawerProps {
    image: Image,
    trackId: UUID,
    otherTracks: Track[],
    onClear: () => void,
    onRewind: () => void,
    onValidate: () => void,
}

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [selectedTool, setSelectedTool] = useState<DrawerToolEnum>('LINE_DRAWER');
    const [displayOtherTracks, setDisplayOtherTracks] = useState(false);

    // TODO quarky
    const track = fakeTopo.sectors[0].boulders[0].tracks[0];

    return (
        <div className={'absolute top-0 bg-black bg-opacity-90 h-full flex flex-col z-500 ' + (isMobile ? 'w-full' : 'w-[calc(100%-600px)]')}>

            <div className='flex-1 flex items-center relative'>
                {/* TODO: CHANGE SIZING */}
               <TracksImage 
                    image={props.image}
                    tracks={[track]}
                    containerClassName='w-full'
               /> 
            </div>

            <Toolbar
                selectedTool={selectedTool}
                displayOtherTracks={displayOtherTracks}
                grade={track.grade}
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