import { useBreakpoint } from "helpers/hooks";
import React from "react";

export type SelectOption<T> = [value: T, label: string];

interface SelectListProps<T> {
	label?: string,
	className?: string;
	options: SelectOption<T>[];
	value?: T;
	white?: boolean,
	big?: boolean,
	justify?: boolean,
	error?: string;
	onChange: (value: T | undefined) => void;
}

export function SelectList<T>({
	white = false,
	big = false,
	justify = true,
	...props
}: SelectListProps<T>) {
	const device = useBreakpoint();
	const selected = props.options.map(o => o[0]).find(val => val === props.value) || [null, null];
	
	const getClassName = (val: T) => {
		let classes = '';
		if (big) {
			classes += ' py-3 px-4 text-xl'
			if (selected === val) classes += " font-semibold"
		}
		else {
			classes += ' py-2 px-3'
			if (selected === val) classes += " font-semibold"
		}

		if (white) {
			classes += ' border-white'
			if (selected === val) classes += " bg-white text-main"
			else classes += " text-white";
		}
		else {
			classes += " border-grey-medium"
			if (selected === val) classes += " bg-main text-white"
			else classes += " text-dark"
		}
		return classes;
	}

	return (
		<div className={`relative w-full ktext-base ${props.className}`}>
			{props.label && <div className={"ktext-label " + (white ? 'text-white' : 'text-dark')}>{props.label}</div>}

			<div className={"flex flex-row flex-wrap w-full gap-6 mt-3" + (justify ? ' justify-between' : '')}>
				{props.options.sort().map(([value, label], index) => (
					<div 
						key={index}
						className={"h-full border border-opacity-25 rounded-sm cursor-pointer ktext-label " + ((selected === value || device === 'mobile') ? '' : "hover:bg-dark hover:bg-opacity-20 ") + getClassName(value)}
						onClick={() => {
							if (selected === value) props.onChange(undefined)
							else props.onChange(value)
						}}
						role="menuitem"
						tabIndex={0}
					>
						{label}
					</div>
				))}
			</div>

			<div className="ktext-error text-error mt-3">{props.error}</div>

		</div>
	);
}
