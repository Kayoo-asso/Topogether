import React, { useState } from 'react';
import { Checkbox, Icon, RoundButton } from 'components';
import { LightGrade, TopoType } from 'types';
import { GradeSliderInput, MultipleSelect, SliderInput } from '..';


export interface TopoFilterOptions {
    types: TopoType[] | null,
    nbOfBoulders: number,
    boulderRange: [number, number],
    gradeRange: [Exclude<LightGrade, 'None'>, Exclude<LightGrade, 'None'>],
    adaptedToChildren: boolean,
}

interface TopoFiltersProps {
    initialOpen?: boolean,
    options: TopoFilterOptions,
    onChange: (options: TopoFilterOptions) => void,
}

export const TopoFilters: React.FC<TopoFiltersProps> = ({
    initialOpen = false,
    ...props
}: TopoFiltersProps) => {
    const [open, setOpen] = useState(initialOpen);

    const updateTopoFilters = <K extends keyof TopoFilterOptions>(option: K, value: TopoFilterOptions[K]) => {
        const newOptions: TopoFilterOptions = {...props.options};
        newOptions[option] = value;
        props.onChange(newOptions);
    }

    const renderFilters = () => (
        <React.Fragment>
            <MultipleSelect 
                id='topo-types'
                label='Types de spot'
                defaultChoices={[
                    {
                        value: 'Bloc',
                    }, 
                    {
                        value: 'Deepwater',
                    },
                    ]}
                onSelect={option => updateTopoFilters('types', option.value)}
            />
            <div>
                <div className='ktext-label text-grey-medium'>Nombre de blocs</div>
                <SliderInput 
                    domain={[0, props.options.nbOfBoulders]}
                    values={props.options.boulderRange}
                    onChange={value => updateTopoFilters('boulderRange', value)}
                />
            </div>
            <div>
                <div className='ktext-label text-grey-medium'>Difficultés</div>
                <GradeSliderInput 
                    onChange={range => updateTopoFilters('gradeRange', range)}
                />
            </div>
            <Checkbox
                label='Adapté aux enfants'
                checked={props.options.adaptedToChildren}
                onClick={isChecked => updateTopoFilters('adaptedToChildren', isChecked)}
            />
        </React.Fragment>
    )

    return (
        <>
            {!open &&
                <RoundButton
                    iconName="filter"
                    iconClass="stroke-main fill-main"
                    iconSizeClass="h-6 w-6"
                    onClick={() => setOpen(true)}
                />
            }
            {open &&
                <div className='bg-white z-40 relative shadow rounded-lg flex flex-col max-w-[60%] md:max-w-[40%] min-w-[250px]'>
                    <div 
                        className='flex flex-row items-center shadow bg-main rounded-lg p-3 pt-4 pl-5 cursor-pointer max-w-[150px]' 
                        onClick={() => setOpen(false)}
                    >
                        <Icon 
                            name='filter'
                            SVGClassName='h-6 w-6 stroke-white fill-white'
                        />
                        <div className='text-white ktext-subtitle ml-3'>Filtres</div>
                    </div>

                    <div className='flex flex-col gap-6 min-h-[100px] p-5 pb-8'>
                        {renderFilters()}
                    </div>
                </div>
            }
        </>
    )
}