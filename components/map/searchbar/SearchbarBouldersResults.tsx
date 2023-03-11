import React from "react";
import { Boulder, Topo, UUID } from "types";
import { Quark } from "helpers/quarky";
import { Map as OLMap } from "ol";
import { SectorListBuilder } from "components/organisms/builder/SectorListBuilder";
import { useRouter } from "next/router";
import { SectorList } from "components/molecules/SectorList";


export interface SearchbarBouldersProps {
	topo: Quark<Topo>;
    boulderResults: Boulder[];
	map: OLMap | null;
	onBoulderResultSelect?: (boulder: Boulder) => void;
	// onAddTopoSelect?: () => void,
}

export const SearchbarBouldersResults: React.FC<SearchbarBouldersProps> = (props: SearchbarBouldersProps) => {
	{/* TODO: Add closing button */}
    const router = useRouter();

	return (
        <div className='flex flex-col px-4'>
            <div className='ktext-section-title py-4'>Liste des blocs</div>
            
            {router.pathname.includes('topo') && 
                <SectorList 
                    topoQuark={props.topo}
                    bouldersToDisplay={props.boulderResults.map(b => b.id)}
                    displayEmptySectors={props.boulderResults.length < 1}
                    expandOnClick={false}
                    map={props.map}
                />
            }
            {router.pathname.includes('builder') && 
                <SectorListBuilder 
                    topoQuark={props.topo}
                    bouldersToDisplay={props.boulderResults.map(b => b.id)}
                    displayEmptySectors={props.boulderResults.length < 1}
                    expandOnClick={false}
                    map={props.map}
                />
            }
        </div>
	);
};

SearchbarBouldersResults.displayName = 'SearchbarBouldersResults';