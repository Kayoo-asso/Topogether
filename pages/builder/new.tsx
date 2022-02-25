import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { LightTopo, StringBetween, TopoType } from 'types';
import { fontainebleauLocation, toLatLng } from 'helpers';
import {
 Button, HeaderDesktop, MapControl, Select, TextInput,
} from 'components';
import Link from 'next/link';
import { v4 } from 'uuid';
import { QuarkIter, useCreateQuark, watchDependencies } from 'helpers/quarky';
import { TopoTypeName } from 'types/EnumNames';
import { api } from 'helpers/services/ApiService';

const NewPage: NextPage = watchDependencies(() => {
  const session = api.user();
  if (!session) return <></>;

  const [step, setStep] = useState(0);

  const topoData = {
    id: v4(),
    creatorId: session.id,
    creatorPseudo: session!.userName,
    name: '' as StringBetween<1, 255>,
    status: 0,
    type: undefined,
    isForbidden: false,
    location: fontainebleauLocation,
    nbSectors: 0,
    nbBoulders: 0,
    nbTracks: 0,
    grades: {
      3: 0, 4: 0, 5:0, 6:0, 7:0, 8:0, 9:0, 
      None: 0,
      Total: 0,
    }
  };

  const topoQuark = useCreateQuark<LightTopo>(topoData);
  const topo = topoQuark();

  const [nameError, setNameError] = useState<string>();
  const [typeError, setTypeError] = useState<string>();
  const [latitudeError, setLatitudeError] = useState<string>();
  const [longitudeError, setLongitudeError] = useState<string>();

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, [nameInputRef]);

  const mapTypeIdToLabel = (typeId: TopoType | undefined) => {
    switch (typeId) {
      case TopoType.Boulder: return 'Blocs';
      case TopoType.Cliff: return 'Falaise';
      case TopoType.DeepWater: return 'Deepwater';
      case TopoType.Multipitch: return 'Grandes voies';
      case TopoType.Artificial: return 'Artificiel';
      default: return undefined;
    }
  }

  const goStep1 = () => {
    // TODO : check if the name already exists
    if (!topo.name) setNameError("Merci d'indiquer un nom valide");
    else setStep(1);
  }
  const goStep2 = () => {
    if (topo.type && isNaN(topo.type)) setTypeError("Merci d'indiquer un type de spot");
    else setStep(2);
  }
  { /* TODO: add Create Topo */ }
  const createTopo = () => {
    console.log(topo);
  };

  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (step === 0) goStep1();
        else if (step === 1) goStep2();
        else createTopo(); 
      }
    });
  });
  
  return (
    <>
      <HeaderDesktop
        backLink="/builder/dashboard"
        title="Nouveau topo"
      />

      <div className='h-contentPlusHeader md:h-full w-full flex flex-row items-center bg-main'>
          <div className='flex flex-col items-center justify-center w-full'>
            {step === 0 &&
              <div className='px-[10%] w-full'>
                <TextInput 
                    ref={nameInputRef}
                    id='topo-name'
                    label='Nom du topo'
                    big
                    white
                    wrapperClassName='w-full mb-10'
                    error={nameError}
                    value={topo.name}
                    onChange={(e) => {
                      setNameError(undefined);
                      topoQuark.set({
                        ...topo,
                        name: e.target.value as StringBetween<1, 255>
                      });
                    }}
                />
                <div className="flex flex-row items-center w-full justify-between md  :justify-end">
                  <Link href="/builder/dashboard">
                    <div className="ktext-base-little cursor-pointer text-white md:mr-16">Annuler</div>
                  </Link>
                  <Button
                    content="Suivant"
                    white
                    onClick={goStep1}
                  />
                </div>
              </div>
            }

            {step === 1 && (
              <div className="px-[10%] w-full">
                <Select
                  id="topo-type"
                  label="Type de spot"
                  names={TopoTypeName}
                  big
                  white
                  wrapperClassname="w-full mb-10"
                  value={topo.type}
                  error={typeError}
                  onChange={(val: TopoType | undefined) => {
                        setTypeError(undefined);
                        topoQuark.set({
                          ...topo,
                          type: val
                        });
                      }}
                />
                <div className="flex flex-row items-center w-full justify-between md:justify-end">
                  <div
                    className="ktext-base-little cursor-pointer text-white md:mr-16"
                    onClick={() => setStep(0)}
                  >
                    Retour
                  </div>
                  <Button
                    content="Suivant"
                    white
                    onClick={goStep2}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="h-[350px] w-full mb-10 md:mb-16">
                  <MapControl
                    displayPhotoButton={false}
                    displayUserMarker={false}
                    zoom={10}
                    center={toLatLng(fontainebleauLocation)}
                    topos={new QuarkIter([topoQuark])}
                    draggableMarkers
                  />
                </div>

                <div className="px-[10%] w-full">
                  <div className="md:flex md:flex-row md:gap-16">
                    <TextInput
                      id="topo-latitude"
                      label="Latitude"
                      error={latitudeError}
                      big
                      white
                      wrapperClassName="w-full mb-10"
                      value={topo.location[1] || ''}
                      onChange={(e) => {
                            setLatitudeError(undefined);
                            topoQuark.set({
                              ...topo,
                              location: [topo.location[0], parseFloat(e.target.value)]
                            })
                        }}
                    />
                    <TextInput
                      id="topo-longitude"
                      label="Longitude"
                      error={longitudeError}
                      big
                      white
                      wrapperClassName="w-full mb-10"
                      value={topo.location[0] || ''}
                      onChange={(e) => {
                            setLongitudeError(undefined);
                            topoQuark.set({
                              ...topo,
                              location: [parseFloat(e.target.value), topo.location[1]]
                            })
                        }}
                    />
                  </div>
                  <div className="flex flex-row items-center w-full justify-between md:justify-end">
                    <div
                      className="ktext-base-little cursor-pointer text-white md:mr-16"
                      onClick={() => setStep(1)}
                    >
                      Retour
                    </div>
                    <Button
                      content="Créer"
                      white
                      onClick={() => {
                            if (isNaN(topo.location[1])) setLatitudeError('Latitude invalide');
                            if (isNaN(topo.location[0])) setLongitudeError('Longitude invalide');
                            if (!isNaN(topo.location[1]) && !isNaN(topo.location[0])) createTopo();
                        }}
                    />
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </>
  );
});

export default NewPage;
