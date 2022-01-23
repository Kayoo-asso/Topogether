import React from 'react';
import { Button, ImageInput, Select, TextArea, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Description, TopoAccess } from 'types';

interface AccessFormProps {
    access: Quark<TopoAccess>,
    className?: string,
}

export const AccessForm: React.FC<AccessFormProps> = watchDependencies((props: AccessFormProps) => {
    const access = props.access();

    return (
        <div 
            className={'flex flex-col gap-6 h-full ' + (props.className ? props.className : '')}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='flex flex-row gap-6 items-end'>
                <Select 
                    id='access-difficulty'
                    label='Difficulté'
                    options={[
                        { value: 'Facile' },
                    ]}
                    value={access.difficulty}
                    onSelect={(value) => props.access.set({
                        ...access,
                        difficulty: value,
                    })}
                />
                <TextInput 
                    id='access-duration'
                    label='Durée'
                    type='number'
                    step={1}
                    value={access.duration}
                    onChange={(e) => props.access.set({
                        ...access,
                        duration: parseInt(e.target.value),
                    })}
                />
            </div>
            
            <div className='ktext-subtitle'>Etapes</div>
            {access.steps?.map((step, index) => {
                const newSteps = access.steps!; 
                return (
                    <div className='flex flex-col'>
                        <ImageInput 
                            value={step.image}
                            onChange={(files) => {
                                newSteps[index].image = files[0];
                                props.access.set({
                                    ...access,
                                    steps: newSteps,
                                })
                            }}
                        />
                        <TextArea 
                            id={'step'+index+'-description'}
                            label='Description'
                            onChange={(e) => {
                                newSteps[index].description = e.target.value as Description;
                                props.access.set({
                                    ...access,
                                    steps: newSteps,
                                })
                            }}
                        />
                    </div>
                )
            })}

            <Button 
                content='Ajouter une étape'
                onClick={() => {
                    const newSteps = access.steps || [];
                    newSteps.push({
                        description: '' as Description
                    })
                }}
            />

        </div>
    )
})