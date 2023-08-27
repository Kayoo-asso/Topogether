import { useTopoSelectStore } from "~/stores/topoSelectStore";
import { ModalBG } from "../ui/Modal";
import { TopoPreview, TopoPreviewProps } from "./TopoPreview";


export const TopoPreviewMobile = (props: Omit<TopoPreviewProps, "topo">) => {
    const topo = useTopoSelectStore((s) => s.selected);
	const onClose = () => useTopoSelectStore.setState({ selected: undefined });

	if (!topo) {
		return null;
	}

    return (
        <div className="md:hidden">
            <ModalBG onBgClick={onClose}>
                <TopoPreview {...props} topo={topo} />
            </ModalBG>
        </div>
    )
}