import React from "react";
import { BouldersFiltersComponents } from "./useBouldersFilters";

import FilterIcon from "assets/icons/filter.svg";

interface BouldersFiltersMobileProps {
    Filters: BouldersFiltersComponents;
}

export const BouldersFiltersMobile: React.FC<BouldersFiltersMobileProps> = (
    {
        Filters
    }: BouldersFiltersMobileProps) => {

	return (
        <div className='flex flex-col h-full gap-2 md:hidden'>           
           <div className='flex flex-row gap-3 items-center px-5'>
                <FilterIcon className="h-6 w-6 fill-main stroke-main" />
                <div className="ktext-subtitle ml-3 text-main">Filtres</div>
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

BouldersFiltersMobile.displayName = 'BouldersFiltersMobile';