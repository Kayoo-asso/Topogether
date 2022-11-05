import React, { useState } from "react";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { Portal } from "helpers/hooks";
import { SelectList, SelectOption } from "./SelectList";
import { TextInput } from "./TextInput";

interface SelectProps<T> {
	id: string;
	label: string;
	title?: string;
	options: SelectOption<T>[];
	big?: boolean;
	white?: boolean;
	justify?: boolean;
	value?: T | undefined;
	error?: string;
	className?: string;
	onChange: (value: T | undefined) => void;
}

export const Select = <T extends number | string>(props: SelectProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);
	const selected = props.options.find((x) => x[0] === props.value);
	return (
		<>
			<TextInput
				label={props.label}
				id={`${props.id}-input`}
				big={props.big}
				white={props.white}
				value={selected ? selected[1] : ""}
				error={props.error}
				readOnly
				pointer
				onClick={() => setIsOpen(true)}
			/>

			<Portal open={isOpen}>
				<div className='w-full h-full bg-dark bg-opacity-95 flex flex-col px-8 absolute top-0 left-0 z-full md:px-[15%]'>
					
					{props.title &&
						<div className="w-full h-[7vh] flex justify-center items-center text-white ktext-title">
							{props.title}
						</div>
					}

					<div className="w-full flex-1 flex flex-col gap-12 justify-center items-center text-grey-light ktext-title">
						<SelectList
							options={props.options}
							value={props.value}
							white
							big
							justify={props.justify}
							className={props.className}
							onChange={props.onChange}
						/>
					</div>

					<div className="w-full h-[10vh] flex justify-center">
						<ValidateButton
							onClick={() => setIsOpen(false)}
						/>
					</div>

				</div>
			</Portal>
		</>		
	);
}
