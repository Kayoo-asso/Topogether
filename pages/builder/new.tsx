import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { GeoCoordinates } from 'types';
import { fontainebleauLocation } from 'helpers';
import { BoulderMarker, Button, HeaderDesktop, MapControl, Select, TextInput } from 'components';
import Link from 'next/link';

const NewTopoPage: NextPage = () => {
  const [step, setStep] = useState(0);
  const [topoName, setTopoName] = useState<string>();
  const [topoType, setTopoType] = useState<string>();
  const [topoPosition, setTopoPosition] = useState<GeoCoordinates>(fontainebleauLocation);

  const [nameError, setNameError] = useState<string>();
  const [latitudeError, setLatitudeError] = useState<string>();
  const [longitudeError, setLongitudeError] = useState<string>();

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, [nameInputRef])

  { /* TODO: add Create Topo */ }
  const createTopo = () => {};

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
                      value={topoName}
                      onChange={(e) => setTopoName(e.target.value)}
                  />
                  <div className='flex flex-row items-center w-full justify-between md:justify-end'>
                      <Link href='/builder/dashboard'>
                          <div className='ktext-base-little cursor-pointer text-white md:mr-16'>Annuler</div>  
                      </Link>
                      <Button 
                          content='Suivant'
                          white
                          onClick={() => {
                              // TODO check name validity
                              setStep(1);
                          }}
                      />
                  </div>
                </div>
            }

            {step === 1 &&
                <div className='px-[10%] w-full'>
                    <Select 
                        id='topo-type'
                        label='Type de spot'
                        choices={[{ value: 'Bloc' }, { value: 'Deepwater'}]}
                        big
                        white
                        wrapperClassname='w-full mb-10'
                        value={topoType}
                        onSelect={(val) => { setTopoType(val)}}
                    />
                    <div className='flex flex-row items-center w-full justify-between md:justify-end'>
                        <div 
                          className='ktext-base-little cursor-pointer text-white md:mr-16'
                          onClick={() => setStep(0)}
                        >
                          Retour
                        </div>  
                      <Button 
                          content='Suivant'
                          white
                          onClick={() => setStep(2)}
                      />
                  </div>
                </div>
            }

            {step === 2 &&
                <>
                  <div className='h-[350px] w-full mb-10 md:mb-16'>
                      <MapControl 
                        displayPhotoButton={false}
                        displayUserMarker={false}
                        zoom={10}
                        center={fontainebleauLocation}
                      >
                      </MapControl>
                  </div>

                  <div className='px-[10%] w-full'>
                    <div className='md:flex md:flex-row md:gap-16'>
                      <TextInput 
                          id='topo-latitude'
                          label='Latitude'
                          error={latitudeError}
                          big
                          white
                          wrapperClassName='w-full mb-10'
                          value={topoPosition?.lat || ''}
                          onChange={(e) => {
                              setTopoPosition({
                                  ...topoPosition,
                                  lat: parseFloat(e.target.value)
                              })
                          }}
                      />
                      <TextInput 
                          id='topo-longitude'
                          label='Longitude'
                          error={longitudeError}
                          big
                          white
                          wrapperClassName='w-full mb-10'
                          value={topoPosition?.lng || ''}
                          onChange={(e) => {
                              setTopoPosition({
                                  ...topoPosition,
                                  lng: parseFloat(e.target.value)
                              })
                          }}
                      />
                    </div>
                    <div className='flex flex-row items-center w-full justify-between md:justify-end'>
                      <div 
                        className='ktext-base-little cursor-pointer text-white md:mr-16'
                        onClick={() => setStep(1)}
                      >
                        Retour
                      </div>  
                      <Button 
                          content='Créer'
                          white
                          onClick={() => {
                              // TODO check position validity
                              createTopo();
                          }}
                      />
                    </div>
                  </div>
                </>
            }
        </div>
      </div>
    </>
  );
};

export default NewTopoPage;
