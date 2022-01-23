import React from 'react';
import { Button, ImageInput, TextArea, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Description, Manager, Name } from 'types';

interface ManagementFormProps {
    manager: Quark<Manager>,
    className?: string,
}

export const ManagementForm: React.FC<ManagementFormProps> = watchDependencies((props: ManagementFormProps) => {
    const manager = props.manager();

    return (
        <div 
            className={'flex flex-col gap-6 h-full ' + (props.className ? props.className : '')}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='flex flex-row gap-6 items-end'>
                <ImageInput 
                    value={manager.image}
                    onChange={(files) => {
                        props.manager.set({
                            ...manager,
                            image: files[0],
                        })
                    }}
                />
                <TextInput 
                    id='manager-name'
                    label='Nom de la structure'
                    value={manager.name}
                    onChange={(e) => props.manager.set({
                        ...manager,
                        name: e.target.value as Name
                    })}
                />
            </div>

            <TextInput 
                id='manager-adress'
                label='Adresse'
                value={manager.adress}
                onChange={(e) => props.manager.set({
                    ...manager,
                    adress: e.target.value as Name
                })}
            />
            <div className='flex flex-row gap-3'>
                <TextInput 
                    id='manager-zip'
                    label='Code postal'
                    type='number'
                    value={manager.zip}
                    onChange={(e) => props.manager.set({
                        ...manager,
                        zip: parseInt(e.target.value)
                    })}
                />
                <TextInput 
                    id='manager-city'
                    label='Ville'
                    value={manager.city}
                    onChange={(e) => props.manager.set({
                        ...manager,
                        city: e.target.value as Name
                    })}
                />
            </div>

            <TextArea 
                id='manager-description'
                label='Description'
                value={manager.description}
                onChange={(e) => props.manager.set({
                    ...manager,
                    description: e.target.value as Description
                })}
            />
            
            <div className='ktext-subtitle'>Contact</div>            

            <TextInput 
                id='manager-contact-name'
                label='Nom'
                value={manager.contactName}
                onChange={(e) => props.manager.set({
                    ...manager,
                    contactName: e.target.value as Name
                })}
            />
            <TextInput 
                id='manager-contact-mail'
                label='Email'
                value={manager.contactMail}
                onChange={(e) => props.manager.set({
                    ...manager,
                    contactMail: e.target.value as Name
                })}
            />
            <TextInput 
                id='manager-contact-phone'
                label='Téléphone'
                value={manager.contactPhone}
                onChange={(e) => props.manager.set({
                    ...manager,
                    contactPhone: e.target.value as Name
                })}
            />

        </div>
    )
})