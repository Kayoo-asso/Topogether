import { Button, Select, TextInput } from 'components';
import { fontainebleauLocation } from 'helpers';
import Link from 'next/link';
import React, { useState } from 'react';
import { GeoCoordinates } from 'types';

interface NewTopoMobileProps {
    createTopo: () => void,
}

export const NewTopoMobile: React.FC<NewTopoMobileProps> = (props: NewTopoMobileProps) => {
    const [step, setStep] = useState(0);
    const [topoName, setTopoName] = useState<string>();
    const [topoType, setTopoType] = useState<string>();
    const [topoPosition, setTopoPosition] = useState<GeoCoordinates>(fontainebleauLocation);

    return (
        <div className='h-full w-full flex flex-col items-center bg-main'>
            
            {step === 0 &&
                <>
                    <TextInput 
                        id='topo-name'
                        label='Nom du topo'
                        error="Nom invalide"
                        value={topoName}
                        onChange={(e) => setTopoName(e.target.value)}
                    />
                    <div className='flex flex-row'>
                        <Link href='/builder/dashboard'>
                            <div className='ktext-base cursor-pointer text-white justify-between'>Annuler</div>  
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
                </>
            }

            {step === 1 &&
                <>
                    <Select 
                        id='topo-type'
                        label='Type de spot'
                        choices={[{ value: 'Bloc' }, { value: 'Deepwater'}]}
                        selected={topoType}
                        onSelect={(val) => setTopoType(val)}
                    />
                </>
            }

            {step === 2 &&
                <>
                    <TextInput 
                        id='topo-latitude'
                        label='Latitude'
                        error="Latitude invalide"
                        value={topoPosition?.lat}
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
                        error="Longitude invalide"
                        value={topoPosition?.lng}
                        onChange={(e) => {
                            setTopoPosition({
                                ...topoPosition,
                                lng: parseFloat(e.target.value)
                            })
                        }}
                    />
                </>
            }

        </div>
    )
}