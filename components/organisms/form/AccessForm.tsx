import React from 'react';
import { Button, ImageInput, Select, TextArea, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Description, TopoAccess } from 'types';
import { DifficultyName } from 'types/EnumNames';

interface AccessFormProps {
    access: Quark<TopoAccess>,
    className?: string,
}

export const AccessForm: React.FC<AccessFormProps> = watchDependencies((props: AccessFormProps) => {
    const access = props.access();

    return (
        <div 
            className={'flex flex-col gap-6 h-full pb-[25px] md:pb-[60px] ' + (props.className ? props.className : '')}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='flex flex-row gap-6 items-end'>
                <Select
                    id='access-difficulty'
                    label='Difficulté'
                    names={DifficultyName}
                    value={access.difficulty}
                    onChange={(value) => props.access.set({
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
            
            <div className='ktext-subtitle mt-3'>Etapes</div>
            <div className='overflow-auto flex flex-col gap-6'>
                {/* TODO : scroll to the new step when it is created */}
                {access.steps?.map((step, index) => {
                    const newSteps = access.steps!; 
                    return (
                        <div className='flex flex-col gap-2' key={index}>
                            <div className='flex flex-row gap-6 items-end'>
                                <div className='w-32'>
                                    <ImageInput 
                                        value={step.imageUrl}
                                        onChange={(files) => {
                                            newSteps[index].imageUrl = files[0].url;
                                            props.access.set({
                                                ...access,
                                                steps: newSteps,
                                            })
                                        }}
                                    />
                                </div>
                                <TextArea 
                                    id={'step'+index+'-description'}
                                    label='Description'
                                    value={step.description}
                                    onChange={(e) => {
                                        newSteps[index].description = e.target.value as Description;
                                        props.access.set({
                                            ...access,
                                            steps: newSteps,
                                        })
                                    }}
                                />
                            </div>
                            <div 
                                className='ktext-base-little text-main cursor-pointer'
                                onClick={() => {
                                    newSteps.splice(index, 1);
                                    props.access.set({
                                        ...access,
                                        steps: newSteps,
                                    })
                                }}
                            >Supprimer</div>
                        </div>
                    )
                })}
            </div>

            <Button 
                content='Ajouter une étape'
                onClick={() => {
                    const newSteps = access.steps || [];
                    newSteps.push({
                        description: '' as Description
                    })
                    props.access.set({
                        ...access,
                        steps: newSteps
                    })
                }} 
            />

        </div>
    )
})