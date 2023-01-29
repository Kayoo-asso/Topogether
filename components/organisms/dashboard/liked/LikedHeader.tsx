import { useState } from "react";

import ArrowSimple from "assets/icons/arrow-full.svg";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { Dropdown, DropdownOption } from "components/molecules/form/Dropdown";

interface LikedHeaderProps {
	noTopos: boolean;
	filter: number;
	setFilter: React.Dispatch<React.SetStateAction<number>>;
}

export const LikedHeader: React.FC<LikedHeaderProps> = (props: LikedHeaderProps) => {
	const bp = useBreakpoint();
    const [filterOpen, setFilterOpen] = useState(false);

	const filterOptions: DropdownOption[] = [
		{ value: 0, label: "Les plus récents", action: () => props.setFilter(0) },
		{ value: 1, label: "Ordre alphabétique", action: () => props.setFilter(1) }
	];

    return (
        <div className="flex flex-col gap-4 px-6 border-b border-grey-medium pt-12 pb-6 md:px-8">
			<div className={`ktext-label-superbig ${bp === 'mobile' ? 'one-word-per-line' : ''}`}>
				Topos favoris
			</div>

			<div className={`${props.noTopos ? 'hidden' : ''} relative flex flex-row justify-between w-full`}>
				<div 
					className={`flex flex-row items-center gap-2 md:cursor-pointer`}
					onClick={() => setFilterOpen(o => !o)}
				>
					{filterOptions.find(f => f.value === props.filter)?.label}
					<ArrowSimple
						className={`h-3 w-3 fill-dark 
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
			</div>
		</div>
    )
}

LikedHeader.displayName = 'LikedHeader';