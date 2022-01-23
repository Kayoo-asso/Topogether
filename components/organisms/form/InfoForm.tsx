import React from 'react';
import { Button, Checkbox, ImageInput, Select, Show, TextArea, TextInput } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Amenities, Description, Name, Topo } from 'types';
import { hasFlag } from 'helpers';

interface InfoFormProps {
    topo: Quark<Topo>,
    className?: string,
}

export const InfoForm: React.FC<InfoFormProps> = watchDependencies((props: InfoFormProps) => {
    const topo = props.topo();
    console.log(topo.hasOtherAmenities);

    return (
        <div 
            className={'flex flex-col gap-6 h-[95%] overflow-auto ' + (props.className ? props.className : '')}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='flex flex-row gap-6 items-end'>
                <ImageInput 
                    value={topo.image}
                    onChange={(files) => {
                        props.topo.set({
                            ...topo,
                            image: files[0],
                        })
                    }}
                />
                <TextInput 
                    id='topo-name'
                    label='Nom du spot'
                    value={topo.name}
                    onChange={(e) => props.topo.set({
                        ...topo,
                        name: e.target.value as Name
                    })}
                />
            </div>

            <TextArea 
                id='topo-description'
                label='Description'
                value={topo.description}
                onChange={(e) => props.topo.set({
                    ...topo,
                    description: e.target.value as Description
                })}
            />

            <Select 
                id='topo-rock-type'
                label='Type de roche'
                options={[
                    { value: 'Gneiss' },
                ]}
                value={topo.rockTypes}
                onSelect={(value) => props.topo.set({
                    ...topo,
                    rockTypes: value,
                })}
            />

            <TextInput 
                id='topo-altitude'
                label='Altitude (m)'
                type='number'
                value={topo.altitude}
                onChange={(e) => props.topo.set({
                    ...topo,
                    altitude: parseInt(e.target.value)
                })}
            />

            <Checkbox 
                label='Spot adapté aux enfants'
                checked={hasFlag(topo.amenities, Amenities.AdaptedToChildren)}
                onClick={() => props.topo.set({
                    ...topo,
                    amenities: topo.amenities ? topo.amenities ^ Amenities.AdaptedToChildren : Amenities.AdaptedToChildren
                })}
            />

            <div className='flex flex-row gap-3'>
                <Checkbox 
                    label='Toilettes'
                    checked={hasFlag(topo.amenities, Amenities.Toilets)}
                    onClick={() => props.topo.set({
                        ...topo,
                        amenities: topo.amenities ? topo.amenities ^ Amenities.Toilets : Amenities.Toilets
                    })}
                />
                <Checkbox 
                    label='Poubelles'
                    checked={hasFlag(topo.amenities, Amenities.Bins)}
                    onClick={() => props.topo.set({
                        ...topo,
                        amenities: topo.amenities ? topo.amenities ^ Amenities.Bins : Amenities.Bins
                    })}
                />
            </div>

            <div className='flex flex-row gap-3'>
                <Checkbox 
                    label="Point d'eau"
                    checked={hasFlag(topo.amenities, Amenities.Waterspot)}
                    onClick={() => props.topo.set({
                        ...topo,
                        amenities: topo.amenities ? topo.amenities ^ Amenities.Waterspot : Amenities.Waterspot
                    })}
                />
                <Checkbox 
                    label='Espace picnic'
                    checked={hasFlag(topo.amenities, Amenities.PicnicArea)}
                    onClick={() => props.topo.set({
                        ...topo,
                        amenities: topo.amenities ? topo.amenities ^ Amenities.PicnicArea : Amenities.PicnicArea
                    })}
                />
            </div>

            <Checkbox 
                label='Abris en cas de pluie'
                checked={hasFlag(topo.amenities, Amenities.Shelter)}
                onClick={() => props.topo.set({
                    ...topo,
                    amenities: topo.amenities ? topo.amenities ^ Amenities.Shelter : Amenities.Shelter
                })}
            />

            <Checkbox 
                label='Autres'
                checked={topo.hasOtherAmenities}
                onClick={() => props.topo.set({
                    ...topo,
                    hasOtherAmenities: !topo.hasOtherAmenities
                })}
            />
            <Show when={() => topo.hasOtherAmenities}>
                <TextArea 
                    id='topo-other-amenities'
                    label='Autres équipements'
                    value={topo.otherAmenities}
                    onChange={(e) => props.topo.set({
                        ...topo,
                        otherAmenities: e.target.value as Description
                    })}
                />
            </Show>

        </div>
    )
})