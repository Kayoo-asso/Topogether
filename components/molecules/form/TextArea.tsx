import React, {
	InputHTMLAttributes,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	id: string;
	label?: string;
	displayLabel?: boolean;
	error?: string;
	pointer?: boolean;
	className?: string;
}

export const TextArea = ({
	displayLabel = true,
	className = "",
	pointer = false,
	...props
}: TextAreaProps) => {
	const ref = useRef<HTMLTextAreaElement>(null);
	const value = props.value || "";

	const [height, setHeight] = useState<number>(0);

	const adaptScrollHeight = useCallback(() => {
		if (ref?.current?.scrollHeight !== height) setHeight(0);
	}, [height]);

	useEffect(() => {
		const refScrollHeight = ref?.current?.scrollHeight;
		if (height === 0 && refScrollHeight) {
			setHeight(refScrollHeight);
		}
	}, [height]);

	return (
		<div className={`relative mt-6 w-full ${className}`}>
			<textarea
				ref={ref}
				{...props}
				style={{ height: value ? `${height}px` : "40px" }}
				placeholder={props.label}
				id={props.id}
				value={value}
				className={`ktext-base peer overflow-hidden border-b-2 border-dark ${
					displayLabel ? "placeholder-transparent" : ""
				} w-full focus:border-main focus:outline-none ${
					pointer ? " cursor-pointer" : ""
				}`}
				onKeyUp={adaptScrollHeight}
				// onKeyDown={(e) => props.onChange(e)}
			/>

			{displayLabel && (
				<label
					htmlFor={props.id}
					className={`ktext-label absolute left-0 -top-6 text-grey-medium transition-all peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-main ${
						pointer ? " cursor-pointer" : ""
					}`}
				>
					{props.label}
				</label>
			)}

			{props.error && (
				<div className="ktext-error text-error">{props.error}</div>
			)}
		</div>
	);
};

TextArea.displayName = "TextInput";
