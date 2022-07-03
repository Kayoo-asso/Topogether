import React, { useRef, useState } from "react";
import { Checkbox } from "components";
import { hasFlag, listFlags } from "helpers/bitflags";
import { Bitflag } from "types";
import { TextInput } from "./TextInput";
import ArrowSimple from "assets/icons/arrow-simple.svg";

interface BitflagMultipleSelectProps<T extends Bitflag> {
	id: string;
	label?: string;
	bitflagNames: [T, string][];
	value: T | undefined;
	onChange: (value: T) => void;
	className?: string;
}

export const BitflagMultipleSelect = <T extends Bitflag>(props: BitflagMultipleSelectProps<T>) => {
	const ref = useRef<HTMLInputElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const textValue = props.value && listFlags(props.value, props.bitflagNames).join(", ");

	return (
		<div id={props.id} className={`relative cursor-pointer ${props.className}`}>
			<TextInput
				ref={ref}
				label={props.label}
				id={`${props.id}-input`}
				value={textValue}
				pointer
				readOnly
				onClick={() => {
					setIsOpen((x) => !x);
					if (!isOpen) ref.current?.focus();
				}}
			/>

			<ArrowSimple
				className={`w-4 h-4 fill-dark absolute right-0 ${
					isOpen ? "top-[14px] rotate-90" : "top-[8px] -rotate-90"
				}`}
			/>

			{isOpen && (
				<div className="pl-4 py-2 bg-white rounded-b h-[200px] absolute overflow-y-auto overflow-x-none z-100 w-full right-0 shadow">
					{props.bitflagNames
						.sort((a, b) => {
							if (a[1] < b[1]) return -1;
							else return 1;
						})
						.map(([flag, name]) => (
							<div
								className="py-4 text-dark ktext-base cursor-pointer flex flex-row items-center"
								key={name}
								onKeyDown={() => props.onChange(flag)}
								onMouseDown={() => props.onChange(flag)}
								role="menuitem"
								tabIndex={0}
							>
								<Checkbox
									className="mr-2"
									checked={props.value && hasFlag(props.value, flag)}
									onClick={() => {}} // No function here! Managed by the event listeners on the div element
								/>
								{name}
							</div>
						))}
				</div>
			)}
		</div>
	);
};
