import React from 'react';
import { Checkbox, MultipleSelect, TextArea, TextInput } from 'components';
import { Quark } from 'helpers/quarky';
import { Description, Name, Track } from 'types';

interface TrackFormProps {
    track: Quark<Track>,
    className?: string,
}

export const TrackForm: React.FC<TrackFormProps> = (props: TrackFormProps) => {
    const track = props.track();

    return (
        <div className={'flex flex-col gap-6 ' + (props.className ? props.className : '')}>
            <TextInput 
                id='track-name'
                label='Nom de la voie'
                value={track.name}
                onChange={(e) => props.track.set({
                    ...track,
                    name: e.target.value as Name
                })}
            />
        
            <div className='flex flex-col gap-3'>
                <Checkbox 
                    label='Traversée'
                    checked={track.isTraverse}
                    onClick={(checked) => props.track.set({
                        ...track,
                        isTraverse: checked
                    })}
                />
                <Checkbox 
                    label='Départ assis'
                    checked={track.isSittingStart}
                    onClick={(checked) => props.track.set({
                        ...track,
                        isSittingStart: checked
                    })}
                />
                <Checkbox 
                    label='Incontournable'
                    checked={track.mustSee}
                    onClick={(checked) => props.track.set({
                        ...track,
                        mustSee: checked
                    })}
                />
            </div>
                    
            <MultipleSelect 
                id='track-techniques'
                label='Techniques'
                //TODO FINISH
                options={[
                    {
                        value: 'Lolotte'
                    },
                    {
                        value: 'Dulfer'
                    }
                ]}
                values={[]}
                onChange={(opts) => console.log(opts)}
            />

            <MultipleSelect 
                id='track-receptions'
                label='Réception'
                //TODO FINISH
                options={[
                    {
                        value: 'Bonne'
                    },
                    {
                        value: 'Mauvaise'
                    }
                ]}
                values={[]}
                onChange={(opts) => console.log(opts)}
            />

            <TextInput 
                id='track-height'
                label='Hauteur'
                type='number'
                step='any'
                value={track.height}
                onChange={(e) => props.track.set({
                    ...track,
                    height: parseFloat(e.target.value)
                })}
            />

            <TextArea 
                id='track-description'
                label='Description'
                value={track.description}
                onChange={(e) => props.track.set({
                    ...track,
                    description: e.target.value as Description
                })}
            />

        </div>
    )
}