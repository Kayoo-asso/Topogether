import { LightTopo } from "types";

interface TopoListProps {
    topos: LightTopo[];
    onClick: (topo: LightTopo) => void;
}

export const TopoList: React.FC<TopoListProps> = (props: TopoListProps) => {

    return (
        <div className="flex flex-col overflow-auto">
            {props.topos.map(topo => (
                <div className="flex flex-row" onClick={() => props.onClick(topo)}>
                    <div></div>
                    <div className="flex flex-col">
                        <div>{topo.name}</div>
                        <div className="flex flex-row">
                            <div>{topo.nbBoulders} blocs - {topo.nbTracks} voies</div>
                            <div>{topo.closestCity}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

TopoList.displayName = "TopoList";