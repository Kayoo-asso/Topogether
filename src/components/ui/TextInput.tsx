import React, { InputHTMLAttributes, forwardRef } from "react";
import { classNames } from "~/utils";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label?: string;
	displayLabel?: boolean;
	error?: string;
	type?: string;
	pointer?: boolean;
	big?: boolean;
	white?: boolean;
	border?: boolean;
	boldValue?: boolean;
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
			border = true,
			boldValue = false,
			...props
		}: TextInputProps,
		ref
	) => (
		<div className={`relative mt-2 w-full ${wrapperClassName}`}>
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
				className={classNames(
					"ktext-base peer h-14 w-full rounded-sm p-4 focus:outline-none",
					boldValue && "font-semibold",
					border && big && "border-3",
					border && !big && "border-2",
					white
						? "border-white bg-white bg-opacity-0 text-white"
						: "border-grey-superlight text-dark focus:border-main",
					displayLabel && "placeholder-transparent",
					pointer && "md:cursor-pointer",
					inputClassName
				)}
			/>

			{displayLabel && (
				<label
					htmlFor={props.id}
					className={classNames(
						"ktext-label absolute left-0 transition-all peer-placeholder-shown:top-4",
						big
							? "-top-7 left-4 text-xl peer-focus:-top-7 peer-focus:left-0"
							: "-top-5 left-4 peer-focus:-top-5 peer-focus:left-0",
						white
							? "text-white peer-focus:text-white"
							: "text-grey-medium peer-focus:text-main",
						pointer && " md:cursor-pointer",
						labelClassName
					)}
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
