import React from 'react';
import { Button, ImageInput, TextArea, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Description, Name, Waypoint } from 'types';

interface WaypointFormProps {
    waypoint: Quark<Waypoint>,
    className?: string,
    onDeleteWaypoint: () => void,
}

export const WaypointForm: React.FC<WaypointFormProps> = watchDependencies((props: WaypointFormProps) => {
    const waypoint = props.waypoint();

    return (
        <div 
            className={'flex flex-col gap-6 h-full ' + (props.className ? props.className : '')}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='flex flex-row gap-6 items-end'>
                <ImageInput 
                    value={waypoint.image}
                    onChange={(files) => {
                        props.waypoint.set({
                            ...waypoint,
                            image: files[0],
                        })
                    }}
                />
                <div className='flex flex-col gap-2 justify-between h-full'>
                    <div className='ktext-subtitle'>Point de repère</div>
                    <TextInput 
                        id='waypoint-name'
                        label='Nom'
                        value={waypoint.name}
                        onChange={(e) => props.waypoint.set({
                            ...waypoint,
                            name: e.target.value as Name
                        })}
                    />
                </div>
            </div>

            <div className='flex flex-row gap-3'>
                <TextInput 
                    id='waypoint-latitude'
                    label='Latitude'
                    type='number'
                    value={waypoint.location.lat}
                    onChange={(e) => props.waypoint.set({
                        ...waypoint,
                        location: {
                            lat: parseFloat(e.target.value),
                            lng: waypoint.location.lng
                        }
                    })}
                />
                <TextInput 
                    id='waypoint-longitude'
                    label='Longitude'
                    type='number'
                    value={waypoint.location.lng}
                    onChange={(e) => props.waypoint.set({
                        ...waypoint,
                        location: {
                            lat: waypoint.location.lat,
                            lng: parseFloat(e.target.value)
                        }
                    })}
                />
            </div>
            
            <TextArea 
                id='waypoint-description'
                label='Description'
                value={waypoint.description}
                onChange={(e) => props.waypoint.set({
                    ...waypoint,
                    description: e.target.value as Description
                })}
            />

            <div className='w-full flex grow items-end'>
                <Button
                    content='Supprimer'
                    onClick={() => props.onDeleteWaypoint()}
                    fullWidth
                />
            </div>

        </div>
    )
})