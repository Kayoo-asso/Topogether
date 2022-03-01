import React, { useState, useCallback } from 'react';
import { Checkbox, Icon, RoundButton } from 'components';
import { ClimbTechniques, LightGrade } from 'types';
import { GradeSliderInput, BitflagMultipleSelect, SliderInput } from '..';
import { ClimbTechniquesName, toggleFlag } from 'helpers';

export interface BoulderFilterOptions {
    techniques: ClimbTechniques,
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

    const updateBoulderFilters = useCallback(<K extends keyof BoulderFilterOptions>(option: K, value: BoulderFilterOptions[K]) => {
        props.onChange({
            ...props.values, 
            [option]: value
        });
    }, [props.values]);

    const updateClimbTechniquesFilters = useCallback((value: ClimbTechniques) => {
        props.onChange({
            ...props.values,
            techniques: toggleFlag(props.values.techniques, value)
    })}, [props.values]);

    const renderFilters = () => (
        <React.Fragment>
             <BitflagMultipleSelect<ClimbTechniques>
                id='track-techniques'
                label='Techniques'
                bitflagNames={ClimbTechniquesName}
                value={props.values.techniques}
                onChange={updateClimbTechniquesFilters}
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
                    values={props.options.gradeRange}
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