import React, { useCallback, useState } from "react";
import { BaseColor } from "types";

export type TabOption = {
	label?: string;
	icon?: SVG;
	iconFill?: boolean;
	iconStroke?: boolean;
	iconClassName?: string;
	color: BaseColor;
	action: () => void;
};

interface TabsFlyProps {
	tabs: TabOption[];
	className?: string;
}

// Pour l'accessibilité, il faudrait pouvoir changer de tab avec Space ou Enter
// https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
export const TabsFly: React.FC<TabsFlyProps> = (props: TabsFlyProps) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const getIconClassName = (tab: TabOption, selected: boolean) => {
		let classes = "";
		if (tab.iconClassName) classes += tab.iconClassName;
		else classes += "w-5 h-5 md:w-6 md:h-6 ";
		if (!selected) {
			if (tab.iconFill) classes += " fill-grey-light ";
			if (tab.iconStroke) classes += " stroke-grey-light ";
			return classes;
		}
		switch (tab.color) {
			case "main":
				if (tab.iconFill) classes += " fill-main ";
				if (tab.iconStroke) classes += " stroke-main ";
				break;
			case "second":
				if (tab.iconFill) classes += " fill-second ";
				if (tab.iconStroke) classes += " stroke-second ";
				break;
			case "third":
				if (tab.iconFill) classes += " fill-third ";
				if (tab.iconStroke) classes += " stroke-third ";
				break;
			default:
		}
		return classes;
	};
	const getLabelClassName = (tab: TabOption, selected: boolean) => {
		let classes = "";
		if (!selected) {
			classes += "text-grey-light ";
			return classes;
		}
		switch (tab.color) {
			case "main":
				classes += "text-main ";
				break;
			case "second":
				classes += "text-second ";
				break;
			case "third":
				classes += "text-third ";
				break;
			default:
		}
		return classes;
	};
	const getBorderClassName = (tab: TabOption, selected: boolean) => {
		if (!selected) return "";
		switch (tab.color) {
			case "main":
				return " border-b-3 border-main";
			case "second":
				return " border-b-3 border-second";
			case "third":
				return " border-b-3 border-third";
			default:
		}
	};

	const selectTabHandler = useCallback((tab, index) => {
		setSelectedTab(index);
		tab.action();
	}, []);

	return (
		<div
			className={`w-[90%] md:w-auto z-full bg-white px-8 md:px-12 rounded-full shadow flex flex-row justify-around items-center ${
				props.className ? props.className : ""
			}`}
		>
			{props.tabs.map((tab, index) => {
				const selected = selectedTab === index;
				return (
					<div
						key={index}
						className={`px-2 md:px-8 cursor-pointer ${getBorderClassName(
							tab,
							selected
						)}`}
						onClick={() => selectTabHandler(tab, index)}
						role="tab"
						tabIndex={index === 0 ? 0 : -1}
					>
						<div className="py-3 md:py-5 flex flex-col items-center">
							{tab.icon && (
								<tab.icon className={`${getIconClassName(tab, selected)}`} />
							)}
							{tab.label && (
								<div
									className={`ktext-label-little md:ktext-label text-center pt-2 ${getLabelClassName(tab, selected)}`}
								>
									{tab.label}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

TabsFly.displayName = 'TabsFly';
