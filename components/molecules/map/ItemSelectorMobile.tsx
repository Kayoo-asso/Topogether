import React from 'react';
import { Image, MapToolEnum } from 'types';
import Sector from 'assets/icons/sector.svg';
import Rock from 'assets/icons/rock.svg';
import Parking from 'assets/icons/parking.svg';
import Waypoint from 'assets/icons/help-round.svg';
import { useBreakpoint } from 'helpers';
import { ImageInput } from '../form';

interface ItemSelectorMobileProps {
    currentTool?: MapToolEnum,
    photoActivated?: boolean,
    onToolSelect: (tool: MapToolEnum) => void,
    onNewPhoto: (img: Image) => void,
    onPhotoButtonClick?: () => void,
}

export const ItemSelectorMobile: React.FC<ItemSelectorMobileProps> = (props: ItemSelectorMobileProps) => {
    const breakpoint = useBreakpoint();

    return (
        <div className='flex flex-row bg-white shadow rounded-full z-20'>

            <div className='flex flex-row items-center gap-5 bg-white rounded-full h-[60px] px-4 md:px-6'>
                {breakpoint === 'desktop' && 
                    <Sector
                        className={'h-6 w-6 cursor-pointer ' + (props.currentTool === "SECTOR" ? 'stroke-main fill-main' : 'stroke-grey-light fill-grey-light')}
                        onClick={() => {
                            props.onToolSelect('SECTOR');
                        }}
                    />
                }
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
            
            {breakpoint === 'mobile' && 
                <ImageInput 
                    button='builder'
                    size='big'
                    multiple={false}
                    activated={props.photoActivated || process.env.NODE_ENV === 'development'}
                    onChange={(files) => props.onNewPhoto(files[0])}
                />
            }

        </div>
    )
}