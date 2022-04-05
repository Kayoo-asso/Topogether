import React, { useCallback, useRef, useState } from 'react';
import { AddTopoCard, TopoCardList, Button } from 'components';
import { HeaderDesktop, LeftbarDesktop } from 'components/layouts';
import { useContextMenu } from 'helpers';
import { LightTopo, TopoStatus } from 'types';
import { UserActionDropdown } from 'components/molecules/cards/UserActionDropdown';
import { ModalDeleteTopo, ModalSubmitTopo } from 'components/organisms';
import { api } from 'helpers/services';

interface RootDashboardProps {
    lightTopos: LightTopo[],
}

export const RootDashboard: React.FC<RootDashboardProps> = (props: RootDashboardProps) => {
    const lightTopos = props.lightTopos;
    const draftLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Draft);
    const submittedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Submitted);
    const validatedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Validated);

    const ref = useRef<HTMLDivElement>(null);
    const [dropdownDisplayed, setDropdownDisplayed] = useState(false);
    const [topoDropdown, setTopoDropddown] = useState<LightTopo>();
    const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();

    const [displayModalSubmit, setDisplayModalSubmit] = useState(false);
    const [displayModalDelete, setDisplayModalDelete] = useState(false);
    const sendTopoToValidation = useCallback(async () => await api.setTopoStatus(topoDropdown!.id, TopoStatus.Submitted), [topoDropdown]);
    const deleteTopo = useCallback(() => api.deleteTopo(topoDropdown!), [topoDropdown]);
  
    useContextMenu(() => setDropdownDisplayed(false), ref.current);
  
    const onContextMenu = useCallback((topo: LightTopo, position: {x: number, y: number}) => {
      setDropdownDisplayed(true);
      setTopoDropddown(topo);
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
  
          <div ref={ref} className="bg-white w-full overflow-y-auto h-contentPlusHeader md:h-contentPlusShell overflow-x-hidden pl-[1%]">
            <div className="px-4 md:px-8 py-6 flex flex-row-reverse justify-between items-center">
              <Button content="Créer un topo" href="/builder/new" />
              <div className="md:hidden ktext-section-title text-center">Mes topos</div>
            </div>
            <TopoCardList
              topos={draftLightTopos}
              status={TopoStatus.Draft}
              title={(
                <div
                  className="text-second-light ktext-section-title px-4 md:px-8"
                >
                  Brouillons
                </div>
              )}
              lastCard={
                <AddTopoCard />
              }
              onContextMenu={onContextMenu}
            />
  
            <TopoCardList
              topos={submittedLightTopos}
              status={TopoStatus.Submitted}
              title={(
                <div
                  className="text-third-light ktext-section-title px-4 md:px-8"
                >
                  En attente de validation
                </div>
              )}
              onContextMenu={onContextMenu}
            />
  
            <TopoCardList
              topos={validatedLightTopos}
              status={TopoStatus.Validated}
              title={(
                <div
                  className="text-main ktext-section-title px-4 md:px-8"
                >
                  Validés
                </div>
              )}
              onContextMenu={onContextMenu}
            />
          </div>
        </div>
        {dropdownDisplayed && topoDropdown && dropdownPosition && (
          <UserActionDropdown 
            position={dropdownPosition} 
            topo={topoDropdown}
            onSendToValidationClick={() => setDisplayModalSubmit(true)}
            onDeleteClick={() => setDisplayModalDelete(true)}
          />
        )}
        {displayModalSubmit &&
            <ModalSubmitTopo 
                onSubmit={sendTopoToValidation} 
                onClose={() => setDisplayModalSubmit(false)}    
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