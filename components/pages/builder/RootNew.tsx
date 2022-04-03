import React, { useEffect, useRef, useState } from 'react';
import { StringBetween, TopoType, User } from 'types';
import { fontainebleauLocation, toLatLng, TopoCreate, createTopo } from 'helpers';
import {
 Button, HeaderDesktop, MapControl, Select, TextInput,
} from 'components';
import Link from 'next/link';
import { v4 } from 'uuid';
import { useCreateQuark, watchDependencies } from 'helpers/quarky';
import { TopoTypeName } from 'types/EnumNames';
import { useRouter } from 'next/router';

interface RootNewProps {
    user: User,
}

export const RootNew: React.FC<RootNewProps> = watchDependencies((props: RootNewProps) => {
  const router = useRouter();

  const [step, setStep] = useState(0);

  const topoData: TopoCreate = {
    id: v4(),
    creator: props.user,
    name: '' as StringBetween<1, 255>,
    status: 0,
    type: undefined,
    forbidden: false,
    location: fontainebleauLocation,
    modified: new Date().getDay()+'-'+new Date().getMonth()+'-'+new Date().getDay(),
  };

  const topoQuark = useCreateQuark<TopoCreate>(topoData);
  const topo = topoQuark();

  const [nameError, setNameError] = useState<string>();
  const [typeError, setTypeError] = useState<string>();
  const [latitudeError, setLatitudeError] = useState<string>();
  const [longitudeError, setLongitudeError] = useState<string>();

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, [nameInputRef]);

  const goStep1 = () => {
    // TODO : check if the name already exists
    if (!topo.name) setNameError("Merci d'indiquer un nom valide");
    else setStep(1);
  }
  const goStep2 = () => {
    if (topo.type && isNaN(topo.type)) setTypeError("Merci d'indiquer un type de spot");
    else setStep(2);
  }

  const create = () => {
    createTopo(topo);
    router.push('/builder/'+topo.id);
  };

  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (step === 0) goStep1();
        else if (step === 1) goStep2();
        else create(); 
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
                    creatingTopo={topoQuark}
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
                            if (!isNaN(topo.location[1]) && !isNaN(topo.location[0])) create();
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
