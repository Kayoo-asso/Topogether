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

interface TabsProps {
	tabs: TabOption[];
	className?: string;
}

// Pour l'accessibilité, il faudrait pouvoir changer de tab avec Space ou Enter
// https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
export const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const getIconClassName = (tab: TabOption, selected: boolean) => {
		let classes = "";
		if (tab.iconClassName) classes += tab.iconClassName;
		else classes += "w-8 h-8 ";
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
		if (!selected) return " border-grey-light";
		switch (tab.color) {
			case "main":
				return " border-main";
			case "second":
				return " border-second";
			case "third":
				return " border-third";
			default:
		}
	};

	const selectTabHandler = useCallback((tab, index) => {
		setSelectedTab(index);
		tab.action();
	}, []);

	return (
		<div
			className={`flex flex-row w-full justify-around ${props.className ? props.className : ""}`}
		>
			{props.tabs.map((tab, index) => {
				const selected = selectedTab === index;
				return (
					<div
						key={index}
						className={`cursor-pointer w-full flex justify-center border-b-2 pb-2${getBorderClassName(
							tab,
							selected
						)}`}
						onClick={() => selectTabHandler(tab, index)}
						role="tab"
						tabIndex={index === 0 ? 0 : -1}
					>
						{tab.icon && <tab.icon className={`${getIconClassName(tab, selected)}`} />}
						{tab.label && (
							<div className={`ktext-label ${getLabelClassName(tab, selected)}`}>{tab.label}</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
