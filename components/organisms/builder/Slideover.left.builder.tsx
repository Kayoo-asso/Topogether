import React from "react";
import { AccessForm, InfoForm, ManagementForm } from "../form";
import { Quark } from "helpers/quarky";
import { Topo } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverLeftDesktop, SlideoverMobile } from "components/atoms/overlays";
import { useSelectStore } from "components/pages/selectStore";



type SlideoverLeftBuilderProps = {
    topo: Quark<Topo>;
	className?: string;
}

export const SlideoverLeftBuilder: React.FC<SlideoverLeftBuilderProps> = (props: SlideoverLeftBuilderProps) => {
    const breakpoint = useBreakpoint();
	const selectedInfo = useSelectStore(s => s.info);
	const flush = useSelectStore(s => s.flush);

    const getTitle = () => {
        switch (selectedInfo) {
            case 'INFO': return "Infos du topo";
            case 'ACCESS': return "Marche d'approche";
            case 'MANAGEMENT': return "Gestionnaires du site";
            default: return undefined;
        }
    }

    const getContent = () => {
        switch (selectedInfo) {
            case 'INFO': return <InfoForm topo={props.topo} />;
            case 'ACCESS': return <AccessForm topo={props.topo} />;
            case 'MANAGEMENT': return <ManagementForm topo={props.topo} />;
            default: return undefined;
        }
    }

	const onClose = () => {
		if (breakpoint === 'mobile') flush.all();
		else flush.info()
	}

	return (
		<>
			{breakpoint === "mobile" && (
				<SlideoverMobile 
					open={selectedInfo !== 'NONE'}
					onClose={onClose}
				>
					<div className={"h-full pl-6 pr-3 py-14 " + (props.className || '')}>
                        <div className="ktext-title mb-6">{getTitle()}</div>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideoverLeftDesktop
					title={getTitle()}
					className={props.className}
					open={selectedInfo !== 'NONE'}
					onClose={onClose}
				>
					{getContent()}
				</SlideoverLeftDesktop>
			)}
		</>
	);
};

SlideoverLeftBuilder.displayName = "SlideoverLeftBuilder"