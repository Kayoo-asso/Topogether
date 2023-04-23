import { useEffect, useState } from "react";
import { TextInput } from "~/components/ui/TextInput";

interface SearchInputProps {
	value: string;
	onChange(value: string): void;
	label: string;
	mobile?: boolean;
}

export function SearchInput(props: SearchInputProps) {
	const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

	useEffect(() => {
		if (inputRef) {
			const handler = (e: KeyboardEvent) => {
				// Handle other keyboard shortcuts here
				if (e.code === "Escape") {
					props.onChange("");
				}
			};
			inputRef.addEventListener("keyup", handler);
			return () => {
				inputRef.removeEventListener("keyup", handler);
			};
		}
	}, [inputRef]);

	return (
		<TextInput
			id="searchbar"
			ref={setInputRef}
			autoComplete="off"
      autoFocus
			label={props.label}
			displayLabel={false}
			border={props.mobile}
			wrapperClassName="w-[95%] mt-0"
			value={props.value}
			onChange={(e) => props.onChange(e.target.value)}
		/>
	);
}
