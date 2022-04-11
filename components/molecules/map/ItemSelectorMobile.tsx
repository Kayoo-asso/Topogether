import React, { useState } from 'react';
import { MapToolEnum } from 'types';
import Rock from 'assets/icons/rock.svg';
import Parking from 'assets/icons/parking.svg';
import Waypoint from 'assets/icons/waypoint.svg';

interface ItemSelectorMobileProps {
    selectedItem: MapToolEnum,
    onItemSelect: (item: MapToolEnum) => void,
}

export const ItemSelectorMobile: React.FC<ItemSelectorMobileProps> = (props: ItemSelectorMobileProps) => {
    const [open, setOpen] = useState(false);

    const FallbackIcon = props.selectedItem === 'ROCK'
        ? Rock
        : props.selectedItem === 'PARKING'
            ? Parking
            : Waypoint

    return (
        <button
            className={'shadow flex flex-col items-center justify-evenly bg-dark rounded-full cursor-pointer z-40 w-[80px] ' + (open ? 'h-[320px]' : 'h-[80px]')}
            onClick={() => setOpen(!open)}
        >
            {open &&
                <>
                    <Waypoint
                        className={props.selectedItem === "WAYPOINT"
                            ? "h-8 w-8 cursor-pointer stroke-main order-last"
                            : "h-7 w-7 cursor-pointer stroke-white"
                        }
                        onClick={() => {
                            props.onItemSelect('WAYPOINT');
                            setOpen(false);
                        }}
                    />
                    <Parking
                        className={props.selectedItem === "PARKING"
                            ? "h-8 w-8 cursor-pointer stroke-main order-last"
                            : "h-6 w-6 cursor-pointer stroke-white"
                        }
                        onClick={() => {
                            props.onItemSelect('PARKING');
                            setOpen(false);
                        }}
                    />
                    <Rock
                        className={props.selectedItem === "ROCK"
                            ? "h-8 w-8 cursor-pointer stroke-main order-last"
                            : "h-6 w-6 cursor-pointer stroke-white"
                        }
                        onClick={() => {
                            props.onItemSelect('ROCK');
                            setOpen(false);
                        }}
                    />
                </>
            }
            {!open &&
                <FallbackIcon className='stroke-main h-8 w-8' />
            }
        </button>
    )
}