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

	const [height, setHeight] = useState<number>(100);

	const adaptScrollHeight = useCallback(() => {
		if (ref?.current?.scrollHeight !== height) setHeight(100);
	}, [height]);

	useEffect(() => {
		const refScrollHeight = ref?.current?.scrollHeight;
		if (height === 0 && refScrollHeight) {
			setHeight(refScrollHeight);
		}
	}, [height]);

	return (
		<div className={`relative w-full mt-2 ${className}`}>
			<textarea
				ref={ref}
				{...props}
				style={{ height: value ? `${height}px` : "100px" }}
				placeholder={props.label}
				id={props.id}
				value={value}
				className={`ktext-base peer w-full p-4 rounded-sm border-2 border-grey-superlight text-dark focus:border-main focus:outline-none " ${
					displayLabel ? "placeholder-transparent" : ""
				}${
					pointer ? " md:cursor-pointer" : ""
				}`}
				onKeyUp={adaptScrollHeight}
			/>

			{displayLabel && (
				<label
					htmlFor={props.id}
					className={`ktext-label absolute left-4 -top-5 text-grey-medium transition-all peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:left-0 peer-focus:text-main ${
						pointer ? " md:cursor-pointer" : ""
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
