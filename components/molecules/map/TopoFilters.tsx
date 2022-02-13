import React, { useCallback, useState } from 'react';
import { Checkbox, Icon, RoundButton } from 'components';
import { LightGrade, TopoType } from 'types';
import { GradeSliderInput, MultipleSelect, SliderInput } from '..';
import { TopoTypeName } from 'types/EnumNames';


export interface TopoFilterOptions {
    types: TopoType[],
    boulderRange: [number, number],
    gradeRange: [Exclude<LightGrade, 'None'>, Exclude<LightGrade, 'None'>],
    adaptedToChildren: boolean,
}

interface TopoFiltersProps {
    initialOpen?: boolean,
    options: TopoFilterOptions,
    values: TopoFilterOptions,
    onChange: (options: TopoFilterOptions) => void,
}
export const TopoFilters: React.FC<TopoFiltersProps> = ({
    initialOpen = false,
    ...props
}: TopoFiltersProps) => {
    console.log(props.values);
    const [open, setOpen] = useState(initialOpen);

    const updateTopoFilters = useCallback(<K extends keyof TopoFilterOptions>(option: K, value: TopoFilterOptions[K]) => {
        props.onChange({
            ...props.values, 
            [option]: value
        });
    }, [props.values]);

    const updateTypeFilters = useCallback((value: TopoType) => {
        console.log(value);
        console.log(props.values.types);

        if(props.values.types.includes(value)) {
            props.onChange({
                    ...props.values,
                    types: props.values.types.filter(v => v !== value)
                });
        } else {
            props.onChange({
                    ...props.values,
                    types: [...props.values.types, value]
                });
        }
     }, [props.values]);


    const renderFilters = () => (
        <React.Fragment>
            <MultipleSelect<TopoType> 
                id='topo-types'
                label='Types de spot'
                names={TopoTypeName}
                values={props.values.types || []}
                onChange={updateTypeFilters}
            />
            <div>
                <div className='ktext-label text-grey-medium'>Nombre de blocs</div>
                <SliderInput 
                    domain={props.options.boulderRange}
                    values={props.values.boulderRange}
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
                checked={props.values.adaptedToChildren}
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