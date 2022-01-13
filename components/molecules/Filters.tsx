import React, { useState } from 'react';
import { Checkbox, Icon, RoundButton } from 'components';
import { UUID } from 'types';
import { DropdownOption, GradeSliderInput, MultipleSelect, Select, SliderInput } from '.';


type BaseFilterOptions = {
    id: UUID,
    label: string,
}
export type FilterOptions = BaseFilterOptions & (
    { type: 'checkbox', value: boolean } |
    { type: 'slider', domain: number[], value: number[] } |
    { type: 'gradeslider', value: number[] } |
    { type: 'select' | 'multipleselect', choices: DropdownOption[], value: DropdownOption[] }
)

interface FiltersProps {
    initialOpen?: boolean,
    filters: FilterOptions[],
    onChange: (filters: FilterOptions[]) => void,
}

export const Filters: React.FC<FiltersProps> = ({
    initialOpen = false,
    ...props
}: FiltersProps) => {
    const [open, setOpen] = useState(initialOpen)
    
    const updateFilters = (id: UUID, value: any) => {
        const newFilters: FilterOptions[] = JSON.parse(JSON.stringify(props.filters));
        const filterIndex = newFilters.findIndex(filter => filter.id === id);
        newFilters[filterIndex]["value"] = value;
        props.onChange(newFilters);
    }

    const renderFilters = () => (
        props.filters.map(filter => (
            <React.Fragment key={filter.id}>
                {filter.type === 'checkbox' &&
                    <Checkbox
                        label={filter.label}
                        checked={filter.value}
                        onClick={isChecked => updateFilters(filter.id, isChecked)}
                    />
                }
                {filter.type === 'multipleselect' &&
                    <MultipleSelect 
                        id={filter.id}
                        label={filter.label}
                        defaultChoices={filter.choices}
                        onSelect={value => {
                            console.log(value);
                            updateFilters(filter.id, value);
                        }}
                    />
                }
                {filter.type === 'select' &&
                    <Select 
                        id={filter.id}
                        label={filter.label}
                        choices={filter.choices}
                        onSelect={value => {
                            console.log(value);
                            updateFilters(filter.id, value);
                        }}
                    />
                }
                {filter.type === 'slider' &&
                    <div>
                        <div className='ktext-label text-grey-medium'>{filter.label}</div>
                        <SliderInput 
                            domain={filter.domain}
                            values={filter.value}
                            onChange={value => updateFilters(filter.id, value)}
                        />
                    </div>
                }
                {filter.type === 'gradeslider' &&
                    <div>
                        <div className='ktext-label text-grey-medium'>{filter.label}</div>
                        <GradeSliderInput 
                            onChange={value => updateFilters(filter.id, value)}
                        />
                    </div>
                }
            </React.Fragment>
        ))
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
                        <div className='text-white ktext-subtitle ml-3'>Filters</div>
                    </div>

                    <div className='flex flex-col gap-6 min-h-[100px] p-5 pb-8'>
                        {renderFilters()}
                    </div>
                </div>
            }
        </>
    )
}