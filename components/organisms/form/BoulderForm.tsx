import React from 'react';
import { Checkbox, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Boulder, Name } from 'types';

interface BoulderFormProps {
    boulder: Quark<Boulder>,
    className?: string,
}

export const BoulderForm: React.FC<BoulderFormProps> = watchDependencies((props: BoulderFormProps) => {
    const boulder = props.boulder();

    return (
        <div 
            className={'flex flex-col gap-6 ' + (props.className ? props.className : '')}
            onClick={(e) => e.stopPropagation()}
        >
            <TextInput 
                id='boulder-name'
                label='Nom du bloc'
                value={boulder.name}
                onChange={(e) => props.boulder.set({
                    ...boulder,
                    name: e.target.value as Name
                })}
            />

            <div className='flex flex-row gap-3'>
                <TextInput 
                    id='boulder-latitude'
                    label='Latitude'
                    type='number'
                    value={boulder.location.lat}
                    onChange={(e) => props.boulder.set({
                        ...boulder,
                        location: {
                            lat: parseFloat(e.target.value),
                            lng: boulder.location.lng
                        }
                    })}
                />
                <TextInput 
                    id='boulder-longitude'
                    label='Longitude'
                    type='number'
                    value={boulder.location.lng}
                    onChange={(e) => props.boulder.set({
                        ...boulder,
                        location: {
                            lat: boulder.location.lat,
                            lng: parseFloat(e.target.value)
                        }
                    })}
                />
            </div>
            
            <div className='flex flex-col gap-3'>
                <Checkbox 
                    label='High Ball'
                    checked={boulder.isHighball}
                    onClick={(checked) => props.boulder.set({
                        ...boulder,
                        isHighball: checked
                    })}
                />
                <Checkbox 
                    label='Incontournable'
                    checked={boulder.mustSee}
                    onClick={(checked) => props.boulder.set({
                        ...boulder,
                        mustSee: checked
                    })}
                />
                <Checkbox 
                    label='Descente dangereuse'
                    checked={boulder.dangerousDescent}
                    onClick={(checked) => props.boulder.set({
                        ...boulder,
                        dangerousDescent: checked
                    })}
                />
            </div>

        </div>
    )
})