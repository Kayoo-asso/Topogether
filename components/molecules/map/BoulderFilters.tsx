import React, { useState } from 'react';
import { Checkbox, Icon, RoundButton } from 'components';
import { Boulder, ClimbTechniques, gradeToLightGrade, LightGrade } from 'types';
import { DropdownOption, GradeSliderInput, MultipleSelect, SliderInput } from '..';


export interface BoulderFilterOptions {
    techniques: ClimbTechniques[] | null,
    tracksRange: [number, number],
    gradeRange: [Exclude<LightGrade, 'None'>, Exclude<LightGrade, 'None'>],
    mustSee: boolean,
}

interface BoulderFiltersProps {
    initialOpen?: boolean,
    options: BoulderFilterOptions,
    values: BoulderFilterOptions,
    onChange: (options: BoulderFilterOptions) => void,
}

export const BoulderFilters: React.FC<BoulderFiltersProps> = ({
    initialOpen = false,
    ...props
}: BoulderFiltersProps) => {
    const [open, setOpen] = useState(initialOpen);

    const updateBoulderFilters = <K extends keyof BoulderFilterOptions>(option: K, value: BoulderFilterOptions[K]) => {
        const newOptions: BoulderFilterOptions = {...props.options};
        newOptions[option] = value;
        props.onChange(newOptions);
    }

    const renderFilters = () => (
        <React.Fragment>
            <MultipleSelect 
                id='boulder-techniques'
                label='Techniques'
                options={[
                    {
                        value: 'Bloc',
                    }, 
                    {
                        value: 'Deepwater',
                    },
                ]}
                values={[{ value: props.values.techniques }] as DropdownOption[]}
                onChange={option => updateBoulderFilters('techniques', option.map(opt => opt.value))}
            />
            <div>
                <div className='ktext-label text-grey-medium'>Nombre de voies</div>
                <SliderInput 
                    domain={props.options.tracksRange}
                    values={props.values.tracksRange}
                    onChange={value => updateBoulderFilters('tracksRange', value)}
                />
            </div>
            <div>
                <div className='ktext-label text-grey-medium'>Difficultés</div>
                <GradeSliderInput 
                    onChange={value => updateBoulderFilters('gradeRange', value)}
                />
            </div>
            <Checkbox
                label='Incontournable'
                checked={props.values.mustSee}
                onClick={isChecked => updateBoulderFilters('mustSee', isChecked)}
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
                <div className='bg-white z-40 relative shadow rounded-lg flex flex-col max-w-[60%] min-w-[250px]'>
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