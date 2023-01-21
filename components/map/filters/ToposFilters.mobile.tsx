import React from "react";
import { TopoFiltersComponents } from "./useToposFilters";

import FilterIcon from "assets/icons/filter.svg";

interface ToposFiltersMobileProps {
    Filters: TopoFiltersComponents;
}

export const ToposFiltersMobile: React.FC<ToposFiltersMobileProps> = (
    {
        Filters
    }: ToposFiltersMobileProps) => {

	return (
        <div className='flex flex-col h-full gap-2 md:hidden'>           
           <div className='flex flex-row gap-3 items-center px-5'>
                <FilterIcon className="h-6 w-6 fill-main stroke-main" />
                <div className="ktext-subtitle ml-3 text-main">Filtres</div>
            </div>

            <div className="flex min-h-[100px] flex-col gap-6 p-5 pb-8">
                <Filters.TopoTypesFilter />
                <Filters.NbOfBouldersFilter />
                <Filters.DifficultyFilter />
                <Filters.ChildrenFilter />
            </div>
        </div>
    )
};

ToposFiltersMobile.displayName = 'ToposFiltersMobile';