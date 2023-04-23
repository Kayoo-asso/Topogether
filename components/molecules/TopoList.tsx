import { TopoTypeToColor } from "helpers/topo";
import { LightTopoOld, UUID } from "types";

import Topo from "assets/icons/topo.svg";
import Marker from "assets/icons/marker.svg";
import Check from "assets/icons/checked.svg";
import { LikeButton } from "components/atoms/buttons/LikeButton";

interface TopoListProps {
	topos: LightTopoOld[];
	likeable?: boolean;
	onUnlike?: boolean;
	selectable?: boolean;
	selected?: UUID[];
	setSelected?: React.Dispatch<React.SetStateAction<UUID[]>>;
	onClick: (topo: LightTopoOld) => void;
}

export const TopoList: React.FC<TopoListProps> = ({
	selectable = false,
	...props
}: TopoListProps) => {
	return (
		<div className="flex w-full flex-col overflow-auto">
			{props.topos.map((topo) => (
				<div
					className="flex flex-row items-center border-b border-grey-medium px-4 py-2 md:cursor-pointer"
					onClick={() => !selectable && props.onClick(topo)}
				>
					<div className="flex w-16">
						{!selectable && (
							<Topo
								className={"fill- ml-2 h-8 w-8" + TopoTypeToColor(topo.type)}
							/>
						)}
						{selectable && props.selected?.includes(topo.id) && (
							<div
								className="relative rounded-full border border-main bg-main px-5 py-5"
								onClick={() =>
									props.setSelected &&
									props.setSelected((s) => s.filter((uuid) => uuid !== topo.id))
								}
							>
								<Check className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform stroke-white" />
							</div>
						)}
						{selectable && !props.selected?.includes(topo.id) && (
							<div
								className="rounded-full border border-grey-medium bg-white px-5 py-5"
								onClick={() =>
									props.setSelected && props.setSelected((s) => [...s, topo.id])
								}
							></div>
						)}
					</div>

					<div className="flex w-full flex-col">
						<div className="ktext-section-title">{topo.name}</div>
						<div className="flex flex-row gap-10">
							<div>
								{topo.nbBoulders} blocs - {topo.nbTracks} voies
							</div>
							<div className="flex flex-row items-end gap-2">
								<Marker
									className={`h-4 w-4 fill-main ${
										topo.closestCity ? "" : "hidden"
									}`}
								/>
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
	);
};

TopoList.displayName = "TopoList";
