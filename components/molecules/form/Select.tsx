import React, { useRef, useState } from "react";
import { TextInput } from "./TextInput";
import ArrowSimple from "assets/icons/arrow-simple.svg";

export type SelectOption<T> = [value: T, label: string];
export type SelectValue = number | string | symbol;
export type SelectLabels<V extends SelectValue> = Record<V, string>;

interface SelectProps<T> {
	id: string;
	label: string;
	wrapperClassname?: string;
	options: SelectOption<T>[];
	big?: boolean;
	white?: boolean;
	value?: T;
	error?: string;
	onChange: (value: T) => void;
}

export function Select<T>({
	big = false,
	white = false,
	...props
}: SelectProps<T>) {
	const ref = useRef<HTMLInputElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const selected = props.options.find((x) => x[0] === props.value);

	return (
		<div
			id={props.id}
			className={`relative cursor-pointer ${props.wrapperClassname}`}
			onClick={() => {
				setIsOpen((x) => !x);
				if (!isOpen) ref.current?.focus();
			}}
		>
			<TextInput
				ref={ref}
				label={props.label}
				id={`${props.id}-input`}
				big={big}
				white={white}
				value={selected ? selected[1] : ""}
				error={props.error}
				readOnly
				pointer
			/>
			<ArrowSimple
				className={`absolute right-3 top-[50%] translate-y-[-50%] h-4 w-4 
				${isOpen ? "rotate-90 top-[55%]" : "-rotate-90"} ${
					white ? "fill-white" : "fill-dark"
				}`}
			/>
			{isOpen && (
				<div className="overflow-x-none absolute right-0 z-100 max-h-[320px] w-full overflow-y-auto rounded-b bg-white py-2 pl-4 shadow">
					{/* TODO */}
					{/* <div
                        className={`text-grey-medium ktext-label mt-5 mb-2`}
                        key="select_label"
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={() => props.onChange(undefined)} 
                    >
                        {props.label}
                    </div> */}
					{props.options.sort().map(([value, label]) => (
						<div
							className="ktext-base flex cursor-pointer flex-row items-center py-4 text-dark"
							key={label}
							onKeyDown={() => {
								props.onChange(value);
							}}
							onMouseDown={() => {
								props.onChange(value);
							}}
							role="menuitem"
							tabIndex={0}
						>
							{label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
