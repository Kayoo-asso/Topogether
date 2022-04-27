import { LikedActionDropdown, TopoCardList } from 'components/molecules';
import React, { useCallback, useRef, useState } from 'react';
import { LightTopo, TopoStatus } from 'types';
import Spinner from 'assets/icons/spinner.svg';
import { useContextMenu } from 'helpers';
import { ModalUnlikeTopo } from '../builder';

interface LikedListProps {
    likedTopos: LightTopo[],
}

export const LikedList: React.FC<LikedListProps> = (props: LikedListProps) => {

    const [loading, setLoading] = useState(false);

    const [displayModalUnlike, setDisplayModalUnlike] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const [topoDropdown, setTopoDropdown] = useState<LightTopo>();
    const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();

    useContextMenu(() => setDropdownPosition(undefined), ref.current);
    const onContextMenu = useCallback((topo: LightTopo, position: { x: number, y: number }) => {
        setTopoDropdown(topo);
        setDropdownPosition(position);
    }, [ref]);

    const unlikeTopo = useCallback(() => {
        //TODO
        alert("à venir");
    }, []);

    return (
        <>
            <div className='flex flex-col gap-6 px-6'>
                <TopoCardList 
                    topos={props.likedTopos}
                    status={TopoStatus.Validated}
                    clickable='topo'
                    noTopoCardContent='Aucun topo liké'
                    onContextMenu={onContextMenu}
                    onClick={(topo) => setLoading(true)}
                />
            </div>

            {loading && 
                <div className='flex justify-center items-center w-full h-full bg-dark bg-opacity-80 absolute z-1000'>
                    <Spinner
                        className="stroke-main w-10 h-10 animate-spin m-2"
                    />
                </div>
            }

            {topoDropdown && dropdownPosition &&
            //TODO : mauvaise position de la dropdown + action pour enlever le like + loading quand on ouvre le topo
                <LikedActionDropdown 
                    topo={topoDropdown}
                    position={dropdownPosition}
                    onUnlikeClick={() => setDisplayModalUnlike(true)}
                />
            }
            {displayModalUnlike &&
                <ModalUnlikeTopo 
                    onUnlike={unlikeTopo} 
                    onClose={() => setDisplayModalUnlike(false)}    
                />
            }
        </>
    )
}

LikedList.displayName = 'LikedList';