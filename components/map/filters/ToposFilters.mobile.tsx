import React from "react";
import { TopoFiltersComponents } from "./useToposFilters";

import FilterIcon from "assets/icons/filter.svg";

interface ToposFiltersMobileProps {
    Filters: TopoFiltersComponents;
    onResetClick: () => void;
}

export const ToposFiltersMobile: React.FC<ToposFiltersMobileProps> = (
    {
        Filters,
        ...props
    }: ToposFiltersMobileProps) => {

	return (
        <div className='flex flex-col h-full gap-2 md:hidden'>       
            <div className='flex flex-row justify-end'>
                <div
                    className="text-second mr-8"
                    onClick={props.onResetClick}
                >Reset</div>
            </div>

            <div className="flex min-h-[100px] flex-col gap-6 px-5 pt-2 pb-8">
                <Filters.TopoTypesFilter />
                <Filters.NbOfBouldersFilter />
                <Filters.DifficultyFilter />
                <Filters.ChildrenFilter />
            </div>
        </div>
    )
};

ToposFiltersMobile.displayName = 'ToposFiltersMobile';