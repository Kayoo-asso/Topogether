import React, {
	MouseEvent,
	TouchEvent,
	ReactElement,
	useCallback,
	useState,
	useRef,
} from "react";
import Link from "next/link";
import { Card, CFImage } from "components";
import { formatDate, encodeUUID } from "helpers/utils";
import equal from "fast-deep-equal/es6";
import { LightTopo, TopoStatus } from "types";
import Checked from "assets/icons/checked.svg";
import Recent from "assets/icons/recent.svg";
import Edit from "assets/icons/edit.svg";

interface TopoCardProps {
	topo: LightTopo;
	clickable?: "builder" | "topo";
	onContextMenu: (topo: LightTopo, position: { x: number; y: number }) => void;
}

const iconSize = "h-4 w-4 md:h-6 md:w-6";

export const TopoCard: React.FC<TopoCardProps> = React.memo(
	({ clickable = "topo", ...props }: TopoCardProps) => {
		const topo = props.topo;

		let TopoIcon;
		let lastAction;

		if (topo.status === TopoStatus.Validated) {
			TopoIcon = <Checked className={`stroke-main ${iconSize}`} />;
			lastAction = topo.validated
				? `Validé le ${formatDate(topo.validated)}`
				: "";
		} else if (topo.status === TopoStatus.Submitted) {
			TopoIcon = <Recent className={`stroke-third ${iconSize}`} />;
			lastAction = topo.submitted
				? `Envoyé le ${formatDate(topo.submitted)}`
				: "";
		} else {
			TopoIcon = <Edit className={`stroke-second-light ${iconSize}`} />;
			lastAction = `Modifié le ${formatDate(props.topo.modified)}`;
		}

		const wrapLink = (elts: ReactElement<any, any>) => {
			if (clickable) {
				return (
					<Link href={`/${clickable}/${encodeUUID(props.topo.id)}`}>
						<a>{elts}</a>
					</Link>
				);
			} else return elts;
		};

		const timer = useRef<number>(0);
		const blockClick = useRef<boolean>(false);
		const handleMouseContextMenu = useCallback(
			(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
				if (e.button === 2 && props.onContextMenu) {
					//Right click
					e.preventDefault();
					props.onContextMenu(props.topo, { x: e.pageX, y: e.pageY });
				}
			},
			[props.topo, props.onContextMenu]
		);
		const handleTouchStartContextMenu = useCallback(
			(e: TouchEvent<HTMLDivElement>) => {
				if (props.onContextMenu) {
					// `setTimeout` returns an integer when called in the browser,
					// but TypeScript gives us the type for `setTimeout` on Node.js
					// -> need `as any`
					timer.current = setTimeout(() => {
						blockClick.current = true;
						props.onContextMenu!(props.topo, {
							x: e.touches[0].pageX,
							y: e.touches[0].pageY,
						});
					}, 800) as any;
				}
			},
			[props.topo, props.onContextMenu]
		);
		const handleTouchEndContextMenu = useCallback(
			(e: TouchEvent<HTMLDivElement>) => {
				clearTimeout(timer.current);
				if (blockClick.current) {
					e.preventDefault();
					blockClick.current = false;
				}
			},
			[]
		);

		return wrapLink(
			<div
				onContextMenu={handleMouseContextMenu}
				onTouchStart={handleTouchStartContextMenu}
				onTouchMove={handleTouchEndContextMenu} // If we move the finer (for example for horizontal scrolling) we don't want to display the context menu
				onTouchEnd={handleTouchEndContextMenu}
			>
				<Card
					className={
						"relative flex flex-col bg-white text-center text-grey-medium" +
						(clickable ? " cursor-pointer" : "")
					}
				>
					<div className="relative top-0 h-[55%] w-full md:h-[75%] rounded-t-lg overflow-hidden">
						<CFImage
							image={props.topo.image}
							modalable={false}
							objectFit="cover"
							alt="topo-image"
							sizeHint={"25vw"}
						/>
					</div>

					<div className="flex h-[45%] flex-row gap-2 px-3 py-1 md:h-[25%] md:items-center md:justify-center md:px-4">
						<div className="hidden md:block">{TopoIcon}</div>

						<div className="flex w-full flex-col items-start overflow-hidden">
							<div className="mb-1 flex flex-row items-center md:my-1 ">
								<div className="stroke-[1.5px] pr-2 md:hidden">{TopoIcon}</div>
								<div className="ktext-title truncate pr-2 text-left text-xs font-bold text-dark">
									{props.topo.name}
								</div>
							</div>

							<div className="flex w-full flex-col flex-wrap items-start justify-between border-t-[1px] py-1 text-xxs">
								<span className="whitespace-nowrap">{`${props.topo.nbBoulders} blocs - ${props.topo.nbTracks} passages`}</span>
								<span className="mr-1 whitespace-nowrap">{lastAction}</span>
							</div>
						</div>
					</div>
				</Card>
			</div>
		);
	},
	equal
);

TopoCard.displayName = "TopoCard";
