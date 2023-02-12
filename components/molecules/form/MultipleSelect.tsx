import React, { useState } from "react";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { TextInput } from "./TextInput";
import { SelectListMultiple } from "./SelectListMultiple";
import { listFlags } from "helpers/bitflags";
import { Bitflag } from "types";
import { Portal } from "helpers/hooks/useModal";

interface MultipleSelectProps<T extends Bitflag> {
	id: string;
	label: string;
	title?: string;
	bitflagNames: [T, string][];
	big?: boolean;
	white?: boolean;
	value?: T | undefined;
	error?: string;
	className?: string;
	onChange: (value: T | undefined) => void;
}

export const MultipleSelect = <T extends Bitflag>(props: MultipleSelectProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<TextInput
				label={props.label}
				id={`${props.id}-input`}
				big={props.big}
				white={props.white}
				value={props.value && listFlags(props.value, props.bitflagNames).join(", ")}
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
						<SelectListMultiple
							bitflagNames={props.bitflagNames}
							value={props.value}
							white
							big
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
