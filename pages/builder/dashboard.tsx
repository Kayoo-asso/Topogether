import React, { useCallback, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { NextPage } from 'next';
import {
  AddTopoCard,
  Button, HeaderDesktop, LeftbarDesktop, TopoCardList,
} from 'components';
import { LightTopo, TopoStatus } from 'types';
import { quarkLightTopo } from 'helpers/fakeData/fakeLightTopoV2';
import { useContextMenu } from 'helpers/hooks/useContextMenu';
import { UserActionDropdown } from 'components/molecules/cards/UserActionDropdown';

const DashboardPage: NextPage = () => {
  const [lightTopos, setLightTopos] = useState<LightTopo[]>([
    quarkLightTopo(),
    quarkLightTopo()
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Submitted,
    //   id: uuid(),
    //   name: 'Les roches qui dansent très souvent',
    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Submitted,
    //   id: uuid(),
    //   name: 'Les roches qui dansent très souvent',
    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Submitted,
    //   id: uuid(),
    //   name: 'Les roches qui dansent très souvent',
    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Submitted,
    //   id: '4',
    //   name: 'Les roches qui dansent très souvent',
    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Submitted,
    //   id: uuid(),
    //   name: 'Les roches qui dansent très souvent',
    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Submitted,
    //   id: uuid(),
    //   name: 'Les roches qui dansent très souvent',
    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Submitted,
    //   id: uuid(),

    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Validated,
    //   id: '8',

    // },
    // {
    //   ...fakeLightTopo,
    //   status: TopoStatus.Draft,
    //   id: uuid(),

    // },
  ]);
  const draftLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Draft);
  const submittedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Submitted);
  const validatedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Validated);
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
      <HeaderDesktop
        backLink="/"
        title="Mes topos"
      />

      <div className="flex flex-row h-content md:h-full">
        <LeftbarDesktop
          currentMenuItem="BUILDER"
        />

        <div ref={ref} className="bg-white overflow-y-auto h-contentPlusHeader md:h-contentPlusShell overflow-x-hidden">
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
        <UserActionDropdown position={dropdownPosition} topo={topoDropdown} />
      )}
    </>
);
};

export default DashboardPage;
