import React from "react";
import { BouldersFiltersComponents } from "./useBouldersFilters";

import FilterIcon from "assets/icons/filter.svg";

interface BouldersFiltersMobileProps {
    Filters: BouldersFiltersComponents;
    onResetClick: () => void,
}

export const BouldersFiltersMobile: React.FC<BouldersFiltersMobileProps> = (
    {
        Filters,
        ...props
    }: BouldersFiltersMobileProps) => {

	return (
        <div className='flex flex-col h-full gap-2 md:hidden'>
            <div className='flex flex-row justify-end'>
                <div
                    className="text-second mr-8"
                    onClick={props.onResetClick}
                >Reset</div>
            </div>

            <div className="flex min-h-[100px] flex-col gap-6 px-5 pt-2 pb-8">
                <Filters.SpecFilter />
                <Filters.NbOfTracksFilter />
                <Filters.DifficultyFilter />
                <Filters.MustSeeFilter />
            </div>
        </div>
    )
};

BouldersFiltersMobile.displayName = 'BouldersFiltersMobile';