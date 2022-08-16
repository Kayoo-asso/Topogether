import React from "react";
import { AccessForm, InfoForm, ManagementForm } from "../form";
import { Quark } from "helpers/quarky";
import { Topo } from "types";
import { SlideoverMobile } from "components/atoms/overlays";
import { SelectedInfo } from "./Slideover.left.builder";
import { SelectedItem } from "types/SelectedItems";


type SlideoverBottomBuilderProps = {
    topo: Quark<Topo>;
    selectedInfo?: SelectedInfo;
	selectedItem?: SelectedItem
	className?: string;
	onClose: () => void;
}

export const SlideoverBottomBuilder: React.FC<SlideoverBottomBuilderProps> = (props: SlideoverBottomBuilderProps) => {


    const getTitle = () => {
        switch (props.selectedInfo) {
            case 'INFO': return "Infos du topo";
            case 'ACCESS': return "Marche d'approche";
            case 'MANAGEMENT': return "Gestionnaires du site";
            default: return undefined;
        }
    }

    const getContent = () => {
        switch (props.selectedInfo) {
            case 'INFO': return <InfoForm topo={props.topo} />;
            case 'ACCESS': return <AccessForm topo={props.topo} />;
            case 'MANAGEMENT': return <ManagementForm topo={props.topo} />;
            default: return undefined;
        }
    }

	return (
		<SlideoverMobile 
			open={!!props.selectedInfo}
			onClose={props.onClose}
		>
			<div className={"h-full pl-6 pr-3 py-14 " + (props.className || '')}>
				<div className="ktext-title mb-6">{getTitle()}</div>
				{getContent()}
			</div>
		</SlideoverMobile>
	);
};

SlideoverBottomBuilder.displayName = "SlideoverLeftBuilder"