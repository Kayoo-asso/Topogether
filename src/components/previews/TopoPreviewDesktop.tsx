import { SlideoverRight } from "../layout/SlideoverRight";
import { TopoPreview, TopoPreviewProps } from "./TopoPreview";
import { useTopoSelectStore } from "~/stores/topoSelectStore";


export const TopoPreviewDesktop = (props: Omit<TopoPreviewProps, "topo">) => {
    const topo = useTopoSelectStore((s) => s.selected);
	const onClose = () => useTopoSelectStore.setState({ selected: undefined });

	if (!topo) {
		return null;
	}

    return (
        <div className="relative hidden md:block">
            <SlideoverRight open onClose={onClose}>
                <TopoPreview {...props} topo={topo} />
            </SlideoverRight>
        </div>
    )
}