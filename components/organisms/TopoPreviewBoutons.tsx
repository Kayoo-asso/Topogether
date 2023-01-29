import { LightTopo } from "types";
import { DownloadButton, LikeButton } from "components/atoms";
import { ShareButton } from "components/atoms/buttons/ShareButton";
import { CloseButton } from "components/atoms/buttons/CloseButton";

interface TopoPreviewBoutonsProps {
    topo: LightTopo;
    onClose: () => void;
}

export const TopoPreviewBoutons: React.FC<TopoPreviewBoutonsProps> = (props: TopoPreviewBoutonsProps) => {

    return (
        <div className="absolute flex flex-row w-full px-2 mt-2 justify-between">

            <div className="relative flex flex-row gap-5 justify-evenly items-center px-6 bg-white rounded-full">
                <LikeButton liked={props.topo.liked} />
                <ShareButton location={props.topo.location} />
                <DownloadButton topo={props.topo} />
            </div>

            <div 
                className="relative bg-white rounded-full px-6 py-6 md:cursor-pointer"
                onClick={props.onClose}
            >
                <CloseButton 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
            </div>

        </div>
    )
}

TopoPreviewBoutons.displayName = "TopoPreviewBoutons";