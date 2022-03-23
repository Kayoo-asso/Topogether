import react from 'react';
import {
    Header, LeftbarDesktop, Tabs, TopoCard,
} from 'components';
import React, { useCallback, useRef, useState } from 'react';
import { LightTopo, TopoStatus } from 'types';
import { quarkLightTopo } from 'helpers/fakeData/fakeLightTopoV2';
import { AdminActionDropdown } from 'components/molecules/cards/AdminActionDropdown';
import { useContextMenu } from 'helpers/hooks/useContextMenu';

interface RootAdminProps {
    lightTopos: LightTopo[],
}

export const RootAdmin: React.FC<RootAdminProps> = (props: RootAdminProps) => {
    const [selectedStatus, setSelectedStatus] = useState<TopoStatus>(TopoStatus.Draft);

    const lightTopos = props.lightTopos;
    const toposToDisplay = lightTopos.filter((topo) => topo.status === selectedStatus);

    const ref = useRef<HTMLDivElement>(null);
    const [dropdownDisplayed, setDropdownDisplayed] = useState(false);
    const [topoDropdown, setTopoDropddown] = useState<LightTopo>();
    const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();
  
  
    { /* TODO: get Light Topos */ }
  
    useContextMenu(() => setDropdownDisplayed(false), ref.current);
  
    const onContextMenu = useCallback((topo: LightTopo, position: {x: number, y: number}) => {
        setDropdownDisplayed(true);
        setTopoDropddown(topo);
        setDropdownPosition(position);
    }, [ref]);

    return (
        <>
            <Header
                backLink="/user/profile"
                title="Administration"
            />

            <div className="h-full flex flex-row bg-white">
                <LeftbarDesktop
                    currentMenuItem="ADMIN"
                />

                <div className="w-full h-[10%] mt-[10%]">
                    <Tabs
                        tabs={[{
                            iconName: 'edit',
                            iconStroke: true,
                            color: 'second',
                            action: () => setSelectedStatus(TopoStatus.Draft),
                        },
                        {
                            iconName: 'recent',
                            iconStroke: true,
                            color: 'third',
                            action: () => setSelectedStatus(TopoStatus.Submitted),
                        },
                        {
                            iconName: 'checked',
                            iconFill: true,
                            color: 'main',
                            action: () => setSelectedStatus(TopoStatus.Validated),
                        },
                        ]}
                    />
                    <div className="overflow-y-scroll h-contentPlusHeader md:h-contentPlusShell hide-scrollbar">
                        <div className="min-w-full flex flex-row flex-wrap justify-evenly">
                            {toposToDisplay.map((topo) => (
                                <TopoCard
                                    key={topo.id}
                                    topo={topo}
                                    onContextMenu={onContextMenu}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {dropdownDisplayed && topoDropdown && dropdownPosition && (
                <AdminActionDropdown topo={topoDropdown} position={dropdownPosition} />
            )}
        </>
    );
};
