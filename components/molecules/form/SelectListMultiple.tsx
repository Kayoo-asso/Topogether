import { hasFlag } from "helpers/bitflags";
import { useBreakpoint } from "helpers/hooks";
import React from "react";
import { Bitflag } from "types";

interface SelectListMultipleProps<T extends Bitflag> {
	label?: string,
	className?: string;
	bitflagNames: [T, string][];
	value: T | undefined;
	white?: boolean,
	big?: boolean,
	justify?: boolean,
	error?: string;
	onChange: (value: T) => void;
}

export const SelectListMultiple = <T extends Bitflag>({
	white = false,
	big = false,
	justify = true,
	...props
}: SelectListMultipleProps<T>) => {
	const device = useBreakpoint();
	
	const getClassName = (val: T | undefined, flag: T) => {
		let classes = '';
		if (big) {
			classes += ' py-3 px-4 text-xl'
			if (hasFlag(val, flag)) classes += " font-semibold"
		}
		else {
			classes += ' py-2 px-3'
			if (hasFlag(val, flag)) classes += " font-semibold"
		}

		if (white) {
			classes += ' border-white'
			if (hasFlag(val, flag)) classes += " bg-white text-main"
			else classes += " text-white";
		}
		else {
			classes += " border-grey-medium"
			if (hasFlag(val, flag)) classes += " bg-main text-white"
			else classes += " text-dark"
		}
		return classes;
	}

	return (
		<div className={`relative w-full ktext-base ${props.className ? props.className : ''}`}>
			{props.label && <div className={"ktext-label " + (white ? 'text-white' : 'text-dark')}>{props.label}</div>}

			<div className={"flex flex-row flex-wrap w-full gap-6 mt-3" + (justify ? ' justify-between' : '')}>
				{props.bitflagNames
					.sort((a, b) => {
						if (a[1] < b[1]) return -1;
						else return 1;
					}).map(([flag, name]) => (
						<div 
							key={name}
							className={"h-full border border-opacity-25 rounded-sm md:cursor-pointer ktext-label " + ((props.value && hasFlag(props.value, flag) || device === 'mobile') ? '' : "hover:bg-dark hover:bg-opacity-20 ") + getClassName(props.value, flag)}
							onClick={() => props.onChange(flag)}
							role="menuitem"
							tabIndex={0}
						>
							{name}
						</div>
					))
				}
			</div>

			<div className="ktext-error text-error mt-3">{props.error}</div>

		</div>
	);
}