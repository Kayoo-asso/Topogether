import { useBreakpoint } from "helpers/hooks";
import React from "react";

export type SelectOption<T> = [value: T, label: string];

interface MultipleSelectTouchProps<T> {
	label?: string,
	wrapperClassname?: string;
	options: SelectOption<T>[];
	value?: T[];
	white?: boolean,
	big?: boolean,
	error?: string;
	onChange: (value: T | undefined) => void;
}

export function MultipleSelectTouch<T>({
	white = false,
	big = false,
	...props
}: MultipleSelectTouchProps<T>) {
	const device = useBreakpoint();
	const selected = props.options.map(o => o[0]).filter(val => props.value?.some(v => v === val));
	
	const getClassName = (val: T) => {
		let classes = '';
		if (big) {
			classes += ' py-3 px-4 text-xl'
			if (selected[0] === val) classes += " font-semibold"
		}
		else {
			classes += ' py-2 px-3'
			if (selected[0] === val) classes += " font-semibold"
		}

		if (white) {
			if (selected[0] === val) classes += " bg-white text-main"
			else classes += " text-white";
		}
		else {
			if (selected[0] === val) classes += " bg-main text-white"
			else classes += " text-dark"
		}
		return classes;
	}

	return (
		<div className={`relative w-full ktext-base ${props.wrapperClassname}`}>
			{props.label && <div className={"ktext-label " + (white ? 'text-white' : 'text-dark')}>{props.label}</div>}

			<div className="flex flex-row flex-wrap	w-full gap-6 mt-3">
				{props.options.sort().map(([value, label], index) => (
					<div 
						key={index}
						className={"h-full rounded-sm cursor-pointer ktext-label " +  ((selected.some(v => v === value) || device === 'mobile') ? '' : "hover:bg-dark hover:bg-opacity-20 ") + getClassName(value)}
						onClick={() => {
							if (selected.some(v => v === value)) props.onChange(undefined)
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