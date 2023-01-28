import { TopoTypeToColor } from "helpers/topo";
import { LightTopo, UUID } from "types";

import Topo from "assets/icons/topo.svg";
import Marker from "assets/icons/marker.svg";
import Check from "assets/icons/checked.svg";
import { LikeButton } from "components/atoms";

interface TopoListProps {
    topos: LightTopo[];
    likeable?: boolean;
    onUnlike?: boolean;
    selectable?: boolean;
    selected?: UUID[];
    setSelected?: React.Dispatch<React.SetStateAction<UUID[]>>;
    onClick: (topo: LightTopo) => void;
}

export const TopoList: React.FC<TopoListProps> = ({
    selectable = false,
    ...props
}: TopoListProps) => {

    return (
        <div className="flex flex-col overflow-auto border-b py-3 border-grey-medium w-full">
            {props.topos.map(topo => (
                <div 
                    className="flex flex-row items-center px-4 md:cursor-pointer" 
                    onClick={() => !selectable && props.onClick(topo)}
                >        
                    <div className="w-16 flex">
                        {!selectable && <Topo className={"ml-2 w-8 h-8 fill-"+TopoTypeToColor(topo.type)} />}
                        {selectable && props.selected?.includes(topo.id) && 
                            <div 
                                className="px-5 py-5 bg-main border border-main rounded-full relative"
                                onClick={() => props.setSelected && props.setSelected(s => s.filter(uuid => uuid !== topo.id))}
                            >
                                <Check className="stroke-white w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        }
                        {selectable && !props.selected?.includes(topo.id) && 
                            <div 
                                className="px-5 py-5 bg-white border border-grey-medium rounded-full"
                                onClick={() => props.setSelected && props.setSelected(s => [...s, topo.id])}
                            >       
                            </div>
                        }
                    </div>

                    <div className="w-full flex flex-col">
                        <div className="ktext-section-title">{topo.name}</div>
                        <div className="flex flex-row gap-10">
                            <div>{topo.nbBoulders} blocs - {topo.nbTracks} voies</div>
                            <div className="flex flex-row gap-2 items-end">
                                <Marker className='w-4 h-4 fill-main' />
                                {topo.closestCity}
                            </div>
                        </div>
                    </div>

                    <div className="pr-2">
                        <LikeButton liked={topo.liked} />
                    </div>
                </div>
            ))}
        </div>
    )
}

TopoList.displayName = "TopoList";