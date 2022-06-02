import React, { useCallback, useRef, useState } from 'react';
import { AddTopoCard, TopoCardList, Button } from 'components';
import { HeaderDesktop, LeftbarDesktop } from 'components/layouts';
import { staticUrl, useContextMenu, useLoader, useModal } from 'helpers';
import { LightTopo, TopoStatus } from 'types';
import { UserActionDropdown } from 'components/molecules/cards/UserActionDropdown';
import { api } from 'helpers/services';
import { watchDependencies } from 'helpers/quarky';

interface RootDashboardProps {
    lightTopos: LightTopo[],
}

export const RootDashboard: React.FC<RootDashboardProps> = watchDependencies((props: RootDashboardProps) => {
  const [Loader, showLoader] = useLoader();  
  const [lightTopos, setLightTopos] = useState(props.lightTopos);
    const draftLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Draft);
    const submittedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Submitted);
    const validatedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Validated);

    const ref = useRef<HTMLDivElement>(null);
    const [topoDropdown, setTopoDropdown] = useState<LightTopo>();
    const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();

    const [ModalDelete, showModalDelete] = useModal();
    const [ModalSubmit, showModalSubmit] = useModal();
    const [ModalUnsubmit, showModalUnsubmit] = useModal();

    const sendTopoToValidation = useCallback(async () => {
      if (topoDropdown) {
        await api.setTopoStatus(topoDropdown.id, TopoStatus.Submitted);
        const submittedTopo = lightTopos.find(lt => lt.id === topoDropdown.id)!;
        submittedTopo.submitted = new Date().toISOString();
        submittedTopo.status = TopoStatus.Submitted;
        setLightTopos(lightTopos.slice());
      }
    }, [topoDropdown, lightTopos]);

    const sendTopoToDraft = useCallback(async () => {
      if (topoDropdown) {
        await api.setTopoStatus(topoDropdown.id, TopoStatus.Draft);
        const toDraftTopo = lightTopos.find(lt => lt.id === topoDropdown.id)!;
        toDraftTopo.submitted = undefined;
        toDraftTopo.status = TopoStatus.Draft;
        setLightTopos(lightTopos.slice());
      }
    }, [topoDropdown, lightTopos]);

    const deleteTopo = useCallback(() => {
      const newLightTopos = lightTopos.filter(lt => lt.id !== topoDropdown?.id);
      api.deleteTopo(topoDropdown!);
      setLightTopos(newLightTopos);
    }, [topoDropdown, lightTopos]);
  
    useContextMenu(() => setDropdownPosition(undefined), ref.current);
    const onContextMenu = useCallback((topo: LightTopo, position: { x: number, y: number }) => {
      setTopoDropdown(topo);
      setDropdownPosition(position);
    }, [ref]);
  
    return (
      <>
        <HeaderDesktop
          backLink="/"
          title="Mes topos"
        />
  
        <div className="flex flex-row w-full h-content md:h-full">
          <LeftbarDesktop
            currentMenuItem="BUILDER"
          />
  
          <div ref={ref} className="bg-white w-full overflow-y-auto h-contentPlusHeader md:h-contentPlusShell overflow-x-hidden pl-[1%] pb-16">
            <div className="px-4 md:px-8 py-6 flex flex-row-reverse justify-between items-center">
              <Button 
                content="Créer un topo" 
                href="/builder/new"
                useLoaderOnClick
              />
              <div className="md:hidden ktext-section-title text-center">Mes topos</div>
            </div>
            <TopoCardList
              topos={draftLightTopos}
              status={TopoStatus.Draft}
              clickable='builder'
              title={(
                <div className="text-second-light ktext-section-title px-4 md:px-8">
                  Brouillons
                </div>
              )}
              lastCard={<AddTopoCard />}
              onContextMenu={onContextMenu}
              onClick={(topo) => showLoader()}
            />
  
            <TopoCardList
              topos={submittedLightTopos}
              status={TopoStatus.Submitted}
              title={(
                <div className="text-third-light ktext-section-title px-4 md:px-8">
                  En attente de validation
                </div>
              )}
              onContextMenu={onContextMenu}
            />
  
            <TopoCardList
              topos={validatedLightTopos}
              status={TopoStatus.Validated}
              clickable='topo'
              title={(
                <div className="text-main ktext-section-title px-4 md:px-8">
                  Validés
                </div>
              )}
              onContextMenu={onContextMenu}
              onClick={(topo) => showLoader()}
            />
          </div>
        </div>

        {topoDropdown && dropdownPosition &&
          <UserActionDropdown 
            position={dropdownPosition} 
            topo={topoDropdown}
            onSendToDraftClick={showModalUnsubmit}
            onSendToValidationClick={showModalSubmit}
            onDeleteClick={showModalDelete}
            onSelect={() => setDropdownPosition(undefined)}
          />
        }
        <ModalSubmit 
          buttonText="Confirmer"
          imgUrl={staticUrl.defaultProfilePicture}
          onConfirm={sendTopoToValidation}  
        >Le topo sera envoyé en validation. Etes-vous sûr de vouloir continuer ?</ModalSubmit>
        <ModalUnsubmit 
          buttonText="Confirmer"
          imgUrl={staticUrl.defaultProfilePicture}
          onConfirm={sendTopoToDraft}   
        >Le topo retournera en brouillon. Etes-vous sûr de vouloir continuer ?</ModalUnsubmit>
        <ModalDelete
          buttonText="Supprimer"
          imgUrl={staticUrl.deleteWarning}
          onConfirm={deleteTopo}
        >Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer ?</ModalDelete>

        <Loader />     
      </>
    );
});