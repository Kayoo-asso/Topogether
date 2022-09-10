import React, { ReactNode } from "react";
import { LightTopo, TopoStatus } from "types";
import { NoTopoCard } from "./NoTopoCard";
import { TopoCard } from "./TopoCard";

// TODO: add a select to sort topos by date or alphabetic order
interface TopoCardListProps {
	topos: LightTopo[];
	status: TopoStatus;
	title?: ReactNode;
	noTopoCardContent?: string;
	lastCard?: ReactNode;
	onClick?: (topo: LightTopo) => void,
	onContextMenu?: (topo: LightTopo, position: { x: number; y: number }) => void;
}

export const TopoCardList: React.FC<TopoCardListProps> = (
	props: TopoCardListProps
) => (
	<div className="pt-4">
		{props.title}
		<div
			id={`topo-card-list-${props.status}`}
			className="hide-scrollbar overflow-x-scroll md:overflow-x-hidden"
		>
			<div className="flex min-w-max flex-row md:min-w-full md:flex-wrap">
				<div className="h-2 w-2 md:hidden"></div>
				{props.topos.length === 0 &&
					(props.status === TopoStatus.Submitted ||
						props.status === TopoStatus.Validated) && (
						<NoTopoCard
							topoStatus={props.status}
							content={props.noTopoCardContent}
						/>
					)}
				{props.topos.map((topo) => (
					<TopoCard
						key={topo.id}
						topo={topo}
						onClick={props.onClick}
						onContextMenu={props.onContextMenu}
					/>
				))}
				{props.lastCard}
			</div>
		</div>
	</div>
);
