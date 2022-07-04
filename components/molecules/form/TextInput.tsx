import React, { InputHTMLAttributes, forwardRef } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label?: string;
	displayLabel?: boolean;
	error?: string;
	type?: string;
	pointer?: boolean;
	big?: boolean;
	white?: boolean;
	wrapperClassName?: string;
	inputClassName?: string;
	labelClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			type = "text",
			displayLabel = true,
			big = false,
			white = false,
			wrapperClassName = "",
			inputClassName = "",
			labelClassName = "",
			pointer = false,
			...props
		}: TextInputProps,
		ref
	) => (
		<div className={`relative w-full ${wrapperClassName}`}>
			<input
				{...props}
				onKeyDown={(e) => {
					e.stopPropagation();
					if (props.onKeyDown) props.onKeyDown(e);
				}}
				ref={ref}
				placeholder={props.label}
				type={type}
				id={props.id}
				value={props.value || ""}
				className={`ktext-base \ peer h-10 w-full focus:outline-none
        ${big ? "border-b-3" : "border-b-2"}  \
        ${
					white
						? "border-white bg-white bg-opacity-0 text-white"
						: "border-dark text-dark focus:border-main"
				} \ 
        ${displayLabel ? "placeholder-transparent" : ""} \
        ${pointer ? " cursor-pointer" : ""} \
        ${inputClassName}`}
			/>

			{displayLabel && (
				<label
					htmlFor={props.id}
					className={`ktext-label \ absolute left-0 transition-all peer-placeholder-shown:top-2
        ${
					big
						? "-top-6 text-xl peer-focus:-top-6"
						: "-top-3.5 peer-focus:-top-3.5"
				} \
        ${
					white
						? "text-white peer-focus:text-white"
						: "text-grey-medium peer-focus:text-main"
				} \
        ${pointer ? " cursor-pointer" : ""} ${labelClassName}`}
				>
					{props.label}
				</label>
			)}

			{props.error && (
				<div className="ktext-error mt-1 text-error">{props.error}</div>
			)}
		</div>
	)
);

TextInput.displayName = "TextInput";
