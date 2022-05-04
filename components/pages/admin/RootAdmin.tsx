import React, { useCallback, useRef, useState } from 'react';
import { TopoCard } from 'components';
import { LeftbarDesktop, Tabs } from 'components/layouts';
import { Header } from 'components/layouts/header/Header';
import { LightTopo, TopoStatus } from 'types';
import { AdminActionDropdown } from 'components/molecules/cards/AdminActionDropdown';
import { useContextMenu } from 'helpers/hooks/useContextMenu';
import { api } from 'helpers/services';
import Edit from 'assets/icons/edit.svg';
import Recent from 'assets/icons/recent.svg';
import Checked from 'assets/icons/checked.svg';
import Spinner from 'assets/icons/spinner.svg';
import { staticUrl, useModal } from 'helpers';

interface RootAdminProps {
    lightTopos: LightTopo[],
}

export const RootAdmin: React.FC<RootAdminProps> = (props: RootAdminProps) => {
    const [selectedStatus, setSelectedStatus] = useState<TopoStatus>(TopoStatus.Draft);

    const [lightTopos, setLightTopos] = useState(props.lightTopos);
    const toposToDisplay = lightTopos.filter((topo) => topo.status === selectedStatus);

    const [loading, setLoading] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const [topoDropdown, setTopoDropddown] = useState<LightTopo>();
    const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();
    
    const [ModalValidate, showModalValidate] = useModal();
    const [ModalUnvalidate, showModalUnvalidate] = useModal();
    const [ModalReject, showModalReject] = useModal();
    const [ModalDelete, showModalDelete] = useModal();

    const validateTopo = useCallback(async() => {
        if (topoDropdown) {
            await api.setTopoStatus(topoDropdown!.id, TopoStatus.Validated);
            const validatedTopo = lightTopos.find(lt => lt.id === topoDropdown.id)!;
            validatedTopo.validated = new Date().toISOString();
            validatedTopo.status = TopoStatus.Validated;
            setLightTopos(lightTopos.slice());
          }
    }, [topoDropdown, lightTopos]);
    const unvalidateTopo = useCallback(async() => {
        if (topoDropdown) {
            await api.setTopoStatus(topoDropdown!.id, TopoStatus.Submitted);
            const unvalidatedTopo = lightTopos.find(lt => lt.id === topoDropdown.id)!;
            unvalidatedTopo.validated = undefined;
            unvalidatedTopo.status = TopoStatus.Submitted;
            setLightTopos(lightTopos.slice());
          }
    }, [topoDropdown, lightTopos]);
    const rejectTopo = useCallback(async () => {
        if (topoDropdown) {
            await api.setTopoStatus(topoDropdown!.id, TopoStatus.Draft);
            const rejectedTopo = lightTopos.find(lt => lt.id === topoDropdown.id)!;
            rejectedTopo.submitted = undefined;
            rejectedTopo.status = TopoStatus.Draft;
            setLightTopos(lightTopos.slice());
          }
    }, [topoDropdown, lightTopos]);
    const deleteTopo = useCallback(() => {
        if (topoDropdown) {
            api.deleteTopo(topoDropdown);
            const newLightTopos = lightTopos.filter(lt => lt.id !== topoDropdown.id)!;
            setLightTopos(newLightTopos);
          }
    }, [topoDropdown, lightTopos]);
  
    useContextMenu(() => setDropdownPosition(undefined), ref.current);
    const onContextMenu = useCallback((topo: LightTopo, position: {x: number, y: number}) => {
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
                    <div className="overflow-y-scroll h-contentPlusHeader md:h-contentPlusShell hide-scrollbar pb-40">
                        <div className="min-w-full flex flex-row flex-wrap px-4 md:px-8 py-6">
                            {toposToDisplay.map((topo) => (
                                <TopoCard
                                    key={topo.id}
                                    topo={topo}
                                    onContextMenu={onContextMenu}
                                    clickable={selectedStatus === TopoStatus.Validated ? 'topo' : 'builder'}
                                    onClick={() => setLoading(true)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {loading && 
                <div className='flex justify-center items-center w-full h-full bg-dark bg-opacity-80 absolute z-1000'>
                    <Spinner
                        className="stroke-main w-10 h-10 animate-spin m-2"
                    />
                </div>
            }

            {topoDropdown && dropdownPosition &&
                <AdminActionDropdown 
                    topo={topoDropdown} 
                    position={dropdownPosition}
                    onValidateClick={showModalValidate}
                    onUnvalidateClick={showModalUnvalidate}
                    onRejectClick={showModalReject}
                    onDeleteClick={showModalDelete}
                    onSelect={() => setDropdownPosition(undefined)}
                />
            }
            <ModalValidate 
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={validateTopo} 
            >Une fois validé, le topo sera accessible par tous les utilisateurs. Etes-vous sûr de vouloir continuer ?</ModalValidate>
            <ModalUnvalidate
                buttonText="Confirmer"
                imgUrl={staticUrl.defaultProfilePicture}
                onConfirm={unvalidateTopo} 
            >Le topo retournera en attente de validation. Etes-vous sûr de vouloir continuer ?</ModalUnvalidate>
            <ModalReject
                buttonText="Confirmer"
                imgUrl={staticUrl.defaultProfilePicture}
                onConfirm={rejectTopo} 
            >Le topo retournera en brouillon. Etes-vous sûr de vouloir continuer ?</ModalReject>
            <ModalDelete
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={deleteTopo} 
            >Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer ?</ModalDelete>
        </>
    );
};
