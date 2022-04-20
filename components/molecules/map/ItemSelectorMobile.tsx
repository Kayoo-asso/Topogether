import React, { useEffect } from 'react';
import { MapToolEnum } from 'types';
import Rock from 'assets/icons/rock.svg';
import Parking from 'assets/icons/parking.svg';
import Waypoint from 'assets/icons/help-round.svg';
// import AddIcon from 'assets/icons/more.svg';
import CameraIcon from 'assets/icons/camera.svg';
import { RoundButton } from 'components/atoms';

interface ItemSelectorMobileProps {
    currentTool?: MapToolEnum,
    onToolSelect: (tool: MapToolEnum) => void,
    onPhotoButtonClick: () => void,
    // onAddButtonClick: () => void,
}

export const ItemSelectorMobile: React.FC<ItemSelectorMobileProps> = (props: ItemSelectorMobileProps) => {

    return (
        <div className='flex flex-row bg-white shadow rounded-full z-20'>

            {/* <RoundButton onClick={props.onAddButtonClick}>
                <AddIcon className='stroke-main h-5 w-5' />
            </RoundButton>  */}

            <div className='flex flex-row items-center gap-5 bg-white rounded-full h-[60px] px-4'>
                <Rock
                    className={'h-6 w-6 cursor-pointer ' + (props.currentTool === "ROCK" ? 'stroke-main' : 'stroke-grey-light')}
                    onClick={() => {
                        props.onToolSelect('ROCK');
                    }}
                />
                <Waypoint
                    className={'h-6 w-6 cursor-pointer ' + (props.currentTool === "WAYPOINT" ? 'fill-third stroke-third' : 'fill-grey-light stroke-grey-light')}
                    onClick={() => {
                        props.onToolSelect('WAYPOINT');
                    }}
                />
                <Parking
                    className={'h-6 w-6 cursor-pointer ' + (props.currentTool === "PARKING" ? 'fill-second' : 'fill-grey-light')}
                    onClick={() => {
                        props.onToolSelect('PARKING');
                    }}
                />
            </div>

            <RoundButton onClick={props.onPhotoButtonClick}>
                <CameraIcon className='stroke-main h-5 w-5' />
            </RoundButton> 

        </div>
    )
}