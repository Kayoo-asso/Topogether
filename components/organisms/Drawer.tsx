import React, { useState } from 'react';
import { DrawerToolEnum, Image, Track } from 'types';
import { isDesktop, isMobile } from 'react-device-detect';
import { Toolbar } from 'components';


interface DrawerProps {
    image: Image,
    track: Track,
}

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [selectedTool, setSelectedTool] = useState<DrawerToolEnum>('LINE_DRAWER');
    const [displayOtherTracks, setDisplayOtherTracks] = useState(false);

    return (
        <div className={'absolute top-0 bg-black bg-opacity-90 h-full flex flex-col z-500 ' + (isMobile ? 'w-full' : 'w-[calc(100%-600px)]')}>

            <div className='flex-1'></div>

            <Toolbar
                selectedTool={selectedTool}
                displayOtherTracks={displayOtherTracks}
                grade={props.track.grade}
                onToolSelect={(tool) => setSelectedTool(tool)}
                onGradeSelect={(grade) => console.log(grade)}
                onClear={() => {}}
                onRewind={() => {}}
                onOtherTracks={() => setDisplayOtherTracks(!displayOtherTracks)}
                onValidate={() => {}}
            />

        </div>
    )
}