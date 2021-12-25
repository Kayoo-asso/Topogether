import { ToolbarMobile } from 'components/molecules/drawer/Toolbar.mobile';
import React, { useState } from 'react';
import { DrawerToolEnum, Image, Track } from 'types';

interface DrawerProps {
    image: Image,
    track: Track,
}

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
    const [selectedTool, setSelectedTool] = useState<DrawerToolEnum>('LINE_DRAWER');
    const [displayOtherTracks, setDisplayOtherTracks] = useState(false);

    return (
        <div className='absolute top-0 bg-black bg-opacity-90 h-contentPlusShell w-full flex flex-col z-500'>

            <div className='flex-1'></div>

            <ToolbarMobile 
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