import React, { useContext, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { Sector, StringBetween, Topo } from 'types';
import { fontainebleauLocation, UserContext } from 'helpers';
import {
 Button, HeaderDesktop, MapControl, Select, TextInput, TopoMarker,
} from 'components';
import Link from 'next/link';
import { v4 } from 'uuid';
import { quark, QuarkArray, useCreateQuark } from 'helpers/quarky';

const NewPage: NextPage = () => {
  const { session } = useContext(UserContext);
  const [step, setStep] = useState(2);

  const topoData = {
    id: v4(),
    creatorId: session!.id,
    name: '' as StringBetween<1, 255>,
    status: 0,
    type: undefined,
    isForbidden: false,
    location: fontainebleauLocation,
    sectors: new QuarkArray<Sector>([]),
    // parkings: [],
    // access: [],
  };

  const topoQuark = useCreateQuark<Topo>(topoData);
  const topo = topoQuark();

  useEffect(() => {
    console.log(topoQuark());
  }, [topoQuark()])

  const [nameError, setNameError] = useState<string>();
  const [typeError, setTypeError] = useState<string>();
  const [latitudeError, setLatitudeError] = useState<string>();
  const [longitudeError, setLongitudeError] = useState<string>();

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, [nameInputRef]);

  const mapTypeIdToLabel = (typeId: number | undefined) => {
    switch (typeId) {
      case undefined: return undefined;
      case 0: return 'Blocs';
      case 1: return 'Falaise';
      case 2: return 'Deepwater';
      case 3: return 'Grandes voies';
      case 4: return 'Artificiel';
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

      <div className='h-full w-full flex flex-row items-center bg-main'>
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
                <div className="flex flex-row items-center w-full justify-between md:justify-end">
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
                  choices={[
                    { value: 0, label: 'Bloc' }, 
                    { value: 1, label: 'Falaise' },
                    { value: 2, label: 'Deepwater' },
                    { value: 3, label: 'Grande voie' },
                    { value: 4, label: 'Artificiel' },
                  ]}
                  big
                  white
                  wrapperClassname="w-full mb-10"
                  value={mapTypeIdToLabel(topo.type)}
                  error={typeError}
                  onSelect={(val: number | undefined) => {
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
                    center={fontainebleauLocation}
                  >
                    <TopoMarker 
                      topo={topoQuark}
                    />
                  </MapControl>
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
                      value={topo.location?.lat || ''}
                      onChange={(e) => {
                            setLatitudeError(undefined);
                            topoQuark.set({
                              ...topo,
                              location: {
                                lng: topo.location.lng,
                                lat: parseFloat(e.target.value)
                              }
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
                      value={topo.location?.lng || ''}
                      onChange={(e) => {
                            setLongitudeError(undefined);
                            topoQuark.set({
                              ...topo,
                              location: {
                                lng: parseFloat(e.target.value),
                                lat: topo.location.lat
                              }
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
                            if (isNaN(topo.location.lat)) setLatitudeError('Latitude invalide');
                            if (isNaN(topo.location.lng)) setLongitudeError('Longitude invalide');
                            if (!isNaN(topo.location.lat) && !isNaN(topo.location.lng)) createTopo();
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
};

export default NewPage;
