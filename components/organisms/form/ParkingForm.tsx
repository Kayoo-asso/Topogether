import React, { useEffect, useRef } from 'react';
import { Button, ImageInput, TextArea, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Description, Name, Parking } from 'types';

interface ParkingFormProps {
    parking: Quark<Parking>,
    className?: string,
    onDeleteParking: () => void,
}

export const ParkingForm: React.FC<ParkingFormProps> = watchDependencies((props: ParkingFormProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const parking = props.parking();

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    return (
        <div 
            className={'flex flex-col gap-6 h-full ' + (props.className ? props.className : '')}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='flex flex-row gap-6 items-end'>
                <div className='w-28'>
                    <ImageInput 
                        value={parking.image}
                        onChange={(files) => {
                            props.parking.set({
                                ...parking,
                                image: files[0],
                            })
                        }}
                        onDelete={() => console.log('delete')} //TODO
                    />
                </div>
                <div className='flex flex-col gap-2 justify-between h-full'>
                    <div className='ktext-subtitle md:mb-3'>Parking</div>
                    <TextInput 
                        ref={nameInputRef}
                        id='parking-name'
                        label='Nom'
                        value={parking.name}
                        onChange={(e) => props.parking.set({
                            ...parking,
                            name: e.target.value as Name
                        })}
                    />
                </div>
            </div>

            <div className='flex flex-row gap-3'>
                <TextInput 
                    id='parking-latitude'
                    label='Latitude'
                    type='number'
                    value={parking.location.lat}
                    onChange={(e) => props.parking.set({
                        ...parking,
                        location: {
                            lat: parseFloat(e.target.value),
                            lng: parking.location.lng
                        }
                    })}
                />
                <TextInput 
                    id='parking-longitude'
                    label='Longitude'
                    type='number'
                    value={parking.location.lng}
                    onChange={(e) => props.parking.set({
                        ...parking,
                        location: {
                            lat: parking.location.lat,
                            lng: parseFloat(e.target.value)
                        }
                    })}
                />
            </div>
            

            <TextInput 
                id='parking-spaces'
                label='Nombre de places'
                type='number'
                value={parking.spaces}
                onChange={(e) => props.parking.set({
                    ...parking,
                    spaces: parseInt(e.target.value)
                })}
            />
            
            <TextArea 
                id='parking-description'
                label='Description'
                value={parking.description}
                onChange={(e) => props.parking.set({
                    ...parking,
                    description: e.target.value as Description
                })}
            />

            <div className='w-full flex grow items-end'>
                <Button
                    content='Supprimer'
                    onClick={() => props.onDeleteParking()}
                    fullWidth
                />
            </div>

        </div>
    )
})