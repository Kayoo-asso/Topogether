import React, { useRef, useState } from "react";
import { Checkbox } from "components";
import { TextInput } from "./TextInput";
import ArrowSimple from "assets/icons/arrow-simple.svg";

type MultipleSelectProps<T> = {
	id: string;
	label?: string;
	options: { label: string; value: T }[];
	values: T[];
	onChange: (value: T) => void;
	className?: string;
};

export const MultipleSelect = <T extends number | string>(
	props: MultipleSelectProps<T>
) => {
	const ref = useRef<HTMLInputElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const textValue = props.options
		?.filter((option) => props.values.includes(option.value))
		.map((option) => option.label)
		.join(", ");

	return (
		<div id={props.id} className={`relative md:cursor-pointer ${props.className}`}>
			<TextInput
				ref={ref}
				label={props.label}
				id={`${props.id}-input`}
				value={textValue || ""}
				pointer
				readOnly
				onClick={() => setIsOpen(!isOpen)}
			/>
			<button
				onClick={() => {
					setIsOpen(!isOpen);
					if (!isOpen) ref.current?.focus();
				}}
			>
				<ArrowSimple
					className={`absolute right-0 h-4 w-4 fill-dark ${
						isOpen ? "top-[14px] rotate-90" : "top-[8px] -rotate-90"
					}`}
				/>
			</button>

			{isOpen && (
				<div className="overflow-x-none absolute right-0 z-100 h-[200px] w-full overflow-y-auto rounded-b bg-white py-2 pl-4 shadow">
					{props.options
						.sort((a, b) => {
							if (a.label < b.label) return -1;
							else return 1;
						})
						.map(({ value, label }) => (
							<div
								className="ktext-base flex md:cursor-pointer flex-row items-center py-4 text-dark"
								key={value}
								onKeyDown={() => {
									props.onChange(value);
								}}
								onMouseDown={() => {
									props.onChange(value);
								}}
								role="menuitem"
								tabIndex={0}
							>
								<Checkbox
									className="mr-2"
									checked={props.values.includes(value)}
									onClick={() => {
										props.onChange(value);
									}}
								/>
								{label}
							</div>
						))}
				</div>
			)}
		</div>
	);
};
