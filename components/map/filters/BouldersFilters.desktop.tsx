import React from "react";
import { useSelectStore } from "components/pages/selectStore";
import { BouldersFiltersComponents } from "./useBouldersFilters";

import FilterIcon from "assets/icons/filter.svg";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";

interface BouldersFiltersDesktopProps {
    Filters: BouldersFiltersComponents;
    onResetClick: () => void;
}

export const BouldersFiltersDesktop: React.FC<BouldersFiltersDesktopProps> = (
    {
        Filters,
        ...props
    }: BouldersFiltersDesktopProps) => {
    const select = useSelectStore(s => s.select);
    const bp = useBreakpoint();
    const open = useSelectStore(s => s.info) === 'FILTERS';

	return (
        <div className={`${open ? '' : 'hidden'} relative z-40 flex min-w-[250px] max-w-[80%] flex-col rounded-lg bg-white shadow md:max-w-[40%]`}>
            <div className='flex flex-row items-center justify-between'>
                <div
                    className={`flex flex-row flex-1 max-w-[150px] items-center rounded-lg bg-main p-3 pt-4 pl-5 shadow md:cursor-pointer`}
                    onClick={() => select.info('NONE', bp)}
                >
                    <FilterIcon className="h-6 w-6 fill-white stroke-white" />
                    <div className="ktext-subtitle ml-3 text-white">Filtres</div>
                </div>

                <div 
                    className="text-second mr-8 md:cursor-pointer"
                    onClick={props.onResetClick}
                >Reset</div>
            </div>

            <div className="flex min-h-[100px] flex-col gap-6 p-5 pb-8">
                <Filters.SpecFilter />
                <Filters.NbOfTracksFilter />
                <Filters.DifficultyFilter />
                <Filters.MustSeeFilter />
            </div>
        </div>
    )
};

BouldersFiltersDesktop.displayName = 'BouldersFiltersDesktop';