import { hasFlag } from "~/helpers/bitflags";
import { useBreakpoint } from "~/components/providers/DeviceProvider";
import React from "react";
import { Bitflag } from "types";
import { classNames } from "~/utils";

interface SelectListMultipleProps<T extends Bitflag> {
	label?: string;
	className?: string;
	bitflagNames: [T, string][];
	value: T | undefined;
	white?: boolean;
	big?: boolean;
	justify?: boolean;
	error?: string;
	onChange: (value: T) => void;
}

export const SelectListMultiple = <T extends Bitflag>({
	white = false,
	big = false,
	justify = true,
	...props
}: SelectListMultipleProps<T>) => {
	const getClassName = (val: T | undefined, flag: T) => {
		let classes = "";
		if (big) {
			classes += " py-3 px-4 text-xl";
			if (hasFlag(val, flag)) classes += " font-semibold";
		} else {
			classes += " py-2 px-3";
			if (hasFlag(val, flag)) classes += " font-semibold";
		}

		if (white) {
			classes += " border-white";
			if (hasFlag(val, flag)) classes += " bg-white text-main";
			else classes += " text-white";
		} else {
			classes += " border-grey-medium";
			if (hasFlag(val, flag)) classes += " bg-main text-white";
			else classes += " text-dark";
		}
		return classes;
	};

	return (
		<div
			className={`ktext-base relative w-full ${
				props.className ? props.className : ""
			}`}
		>
			{props.label && (
				<div className={"ktext-label " + (white ? "text-white" : "text-dark")}>
					{props.label}
				</div>
			)}

			<div
				className={
					"mt-3 flex w-full flex-row flex-wrap gap-6" +
					(justify ? " justify-between" : "")
				}
			>
				{props.bitflagNames
					.sort((a, b) => {
						if (a[1] < b[1]) return -1;
						else return 1;
					})
					.map(([flag, name]) => (
						<button
							key={name}
							className={classNames(
								"ktext-label h-full rounded-sm border border-opacity-25 md:cursor-pointer",
								hasFlag(props.value, flag) &&
									"md:hover:bg-dark md:hover:bg-opacity-20",
								getClassName(props.value, flag)
							)}
							onClick={() => props.onChange(flag)}
							tabIndex={0}
						>
							{name}
						</button>
					))}
			</div>

			<div className="ktext-error mt-3 text-error">{props.error}</div>
		</div>
	);
};
