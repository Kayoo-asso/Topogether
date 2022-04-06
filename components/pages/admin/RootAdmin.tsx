import {
    TopoCard,
} from 'components';
import { Header, LeftbarDesktop, Tabs } from 'components/layouts';
import React, { useCallback, useRef, useState } from 'react';
import { LightTopo, TopoStatus } from 'types';
import { AdminActionDropdown } from 'components/molecules/cards/AdminActionDropdown';
import { useContextMenu } from 'helpers/hooks/useContextMenu';
import { ModalDeleteTopo, ModalRejectTopo, ModalValidateTopo } from 'components/organisms';
import { api } from 'helpers/services';
import Edit from 'assets/icons/edit.svg';
import Recent from 'assets/icons/recent.svg';
import Checked from 'assets/icons/checked.svg';

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
    
    const [displayModalValidate, setDisplayModalValidate] = useState<boolean>();
    const [displayModalReject, setDisplayModalReject] = useState<boolean>();
    const [displayModalDelete, setDisplayModalDelete] = useState<boolean>();

    const validateTopo = useCallback(async() => await api.setTopoStatus(topoDropdown!.id, TopoStatus.Validated), [topoDropdown]);
    const rejectTopo = useCallback(async () => await api.setTopoStatus(topoDropdown!.id, TopoStatus.Draft), [topoDropdown]);
    const deleteTopo = useCallback(() => api.deleteTopo(topoDropdown!), [topoDropdown]);
  
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
                            icon: Edit,
                            iconStroke: true,
                            color: 'second',
                            action: () => setSelectedStatus(TopoStatus.Draft),
                        },
                        {
                            icon: Recent,
                            iconStroke: true,
                            color: 'third',
                            action: () => setSelectedStatus(TopoStatus.Submitted),
                        },
                        {
                            icon: Checked,
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
                <AdminActionDropdown 
                    topo={topoDropdown} 
                    position={dropdownPosition}
                    onValidateClick={() => setDisplayModalValidate(true)}
                    onRejectClick={() => setDisplayModalReject(true)}
                    onDeleteClick={() => setDisplayModalDelete(true)}
                />
            )}
            {displayModalReject &&
                <ModalRejectTopo 
                    onReject={rejectTopo}
                    onClose={() => setDisplayModalReject(false)}
                />
            }
            {displayModalValidate &&
                <ModalValidateTopo 
                    onValidate={validateTopo}
                    onClose={() => setDisplayModalValidate(false)}
                />
            }
            {displayModalDelete &&
                <ModalDeleteTopo 
                    onDelete={deleteTopo}
                    onClose={() => setDisplayModalDelete(false)}
                />
            }
        </>
    );
};
