import React from "react";
import { AccessForm, InfoForm, ManagementForm } from "../form";
import { Quark } from "helpers/quarky";
import { Topo } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverLeftDesktop, SlideoverMobile } from "components/atoms";

export type InfoType = "INFO" | "ACCESS" | "MANAGEMENT";

type SlideoverLeftBuilderProps = {
    topo: Quark<Topo>;
    selected?: InfoType;
	className?: string;
	onClose: () => void;
}

export const SlideoverLeftBuilder: React.FC<SlideoverLeftBuilderProps> = (props: SlideoverLeftBuilderProps) => {
    const breakpoint = useBreakpoint();

    const getTitle = () => {
        switch (props.selected) {
            case 'INFO': return "Infos du topo";
            case 'ACCESS': return "Marche d'approche";
            case 'MANAGEMENT': return "Gestionnaires du site";
            default: return undefined;
        }
    }

    const getContent = () => {
        switch (props.selected) {
            case 'INFO': return <InfoForm topo={props.topo} />;
            case 'ACCESS': return <AccessForm topo={props.topo} />;
            case 'MANAGEMENT': return <ManagementForm topo={props.topo} />;
            default: return undefined;
        }
    }

	return (
		<div className="z-100">
			{breakpoint === "mobile" && (
				<SlideoverMobile onClose={props.onClose}>
					<div className={"h-full px-6 pb-10 mt-10 overflow-auto " + (props.className || '')}>
                        <div className="ktext-title mb-6">{getTitle()}</div>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideoverLeftDesktop
					title={getTitle()}
					className={props.className}
					open={!!props.selected}
					onClose={props.onClose}
				>
					{getContent()}
				</SlideoverLeftDesktop>
			)}
		</div>
	);
};

SlideoverLeftBuilder.displayName = "SlideoverLeftBuilder"