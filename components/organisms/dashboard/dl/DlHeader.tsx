import { useState } from "react";
import { UUID } from "types";

import ArrowSimple from "assets/icons/arrow-full.svg";
import Bin from "assets/icons/bin.svg";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { Dropdown, DropdownOption } from "components/molecules/form/Dropdown";

interface DlHeaderProps {
	noTopos: boolean;
	filter: number;
	setFilter: React.Dispatch<React.SetStateAction<number>>;
	isDeleting: boolean;
	setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
	setDisplayTabs: React.Dispatch<React.SetStateAction<boolean>>;
	setToDelete: React.Dispatch<React.SetStateAction<UUID[]>>;
}

export const DlHeader: React.FC<DlHeaderProps> = (props: DlHeaderProps) => {
	const bp = useBreakpoint();
    const [filterOpen, setFilterOpen] = useState(false);

	const filterOptions: DropdownOption[] = [
		{ value: 0, label: "Les plus récents", action: () => props.setFilter(0) },
		{ value: 1, label: "Ordre alphabétique", action: () => props.setFilter(1) }
	];

    return (
        <div className="flex flex-col gap-4 px-6 border-b border-grey-medium pt-12 pb-6 md:px-8">
			<div className={`ktext-label-superbig ${bp === 'mobile' ? 'one-word-per-line' : ''}`}>
				Topos téléchargés
			</div>

			<div className={`${props.noTopos ? 'hidden' : ''} relative flex flex-row justify-between w-full`}>
				<div 
					className={`flex flex-row items-center gap-2 ${props.isDeleting ? 'text-grey-light' : 'md:cursor-pointer'}`}
					onClick={() => !props.isDeleting && setFilterOpen(o => !o)}
				>
					{filterOptions.find(f => f.value === props.filter)?.label}
					<ArrowSimple
						className={`h-3 w-3 
						${props.isDeleting ? 'fill-grey-light ' : 'fill-dark '}
						${filterOpen ? "-rotate-90" : "rotate-90"}`}
					/>
					{filterOpen &&
						<Dropdown 
							options={filterOptions}
							className="top-[100%]"
							onSelect={() => setFilterOpen(false)}
						/>
					}
				</div>

				<div 
					className={`${props.isDeleting ? 'hidden' : ''} flex flex-row items-center gap-2 px-6 py-2 text-error md:cursor-pointer`}
					onClick={() => {
						setFilterOpen(false);
						props.setDisplayTabs(false);
						props.setIsDeleting(true);
					}}
				>
					Supprimer
					<Bin className="w-3 h-3 stroke-error" />
				</div>
				<div 
					className={`${props.isDeleting ? '' : 'hidden'} text-error bg-error bg-opacity-20 px-6 py-2 rounded-full md:cursor-pointer`}
					onClick={() => {
						props.setToDelete(s => []);
						props.setIsDeleting(false);
						props.setDisplayTabs(true);
					}}
				>
					Annuler  X
				</div>
			</div>
		</div>
    )
}

DlHeader.displayName = 'DlHeader';