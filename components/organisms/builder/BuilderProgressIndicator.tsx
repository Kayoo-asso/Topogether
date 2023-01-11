import React, { useEffect, useRef, useState } from "react";
import { watchDependencies } from "helpers/quarky";
import { Topo } from "types";
import Clear from "assets/icons/clear.svg";
import Checked from "assets/icons/checked.svg";
import { Rule, validateRule, rulesText } from "helpers/topo";
import { useSelectStore } from "components/pages/selectStore";
import { useBreakpoint } from "helpers/hooks";

interface BuilderProgressIndicatorProps {
	topo: Topo;
	progress: number;
}

const displayRule = (topo: Topo, key: Rule) => {
	return (
		<div className={"ml-7 flex items-center"}>
			{validateRule(topo, key) ? (
				<Checked className="m-2 h-3 w-3 stroke-main" />
			) : (
				<Clear className="m-1 h-5 w-5 stroke-grey-medium" />
			)}
			<div>{rulesText[key]}</div>
		</div>
	);
};

const displayMainRule = (
	topo: Topo,
	key: Rule | "INFOS_TOPO" | "INFOS_ACCESS"
) => {
	return (
		<div className={"flex items-center"}>
			{validateRule(topo, key) ? (
				<Checked className="m-2 h-4 w-4 stroke-main" />
			) : (
				<Clear className="m-1 h-6 w-6 stroke-grey-medium" />
			)}
			<div>{rulesText[key]}</div>
		</div>
	);
};

export const BuilderProgressIndicator: React.FC<BuilderProgressIndicatorProps> =
	watchDependencies((props: BuilderProgressIndicatorProps) => {
		const breakpoint = useBreakpoint();
		const [open, setOpen] = useState(false);
		const select = useSelectStore(s => s.select);
		const ref = useRef<HTMLDivElement>(null);

		const topo = props.topo;

		useEffect(() => {
			if (ref) {
				document.addEventListener("click", (e) => {
					if (open && ref.current && !ref.current.contains(e.target as Node)) {
						setOpen(false);
					}
				});
			}
		}, [open, ref]);

		return (
			<div ref={ref}>
				<div
					onClick={(e) => {
						setOpen(!open);
						e.stopPropagation();
					}}
					className="ktext-light flex h-10 w-10 md:cursor-pointer items-center justify-center rounded-full border-2 border-white text-white"
				>
					{props.progress}%
				</div>
				{open && (
					<div
						className={`absolute right-5 top-[7%] z-1000 flex w-[90%] flex-col rounded bg-white p-5 shadow md:right-auto md:-ml-5 md:w-[23%] md:min-w-[340px]`}
					>
						<div
							className="my-2 md:cursor-pointer"
							onClick={() => {
								select.info("INFO", breakpoint);
								setOpen(false);
							}}
						>
							{displayMainRule(topo, "INFOS_TOPO")}
							{displayRule(topo, "TOPO_IMAGE")}
							{displayRule(topo, "DESCRIPTION")}
							{displayRule(topo, "ROCK_TYPE")}
							{displayRule(topo, "ALTITUDE")}
						</div>
						<div className="my-2">
							{displayMainRule(topo, "PARKINGS")}
						</div>
						<div
							className="my-2 md:cursor-pointer"
							onClick={() => {
								select.info("ACCESS", breakpoint)
								setOpen(false);
							}}
						>
							{displayMainRule(topo, "INFOS_ACCESS")}
							{displayRule(topo, "ACCESS_DURATION")}
							{displayRule(topo, "ACCESS_DIFFICULTY")}
							{displayRule(topo, "ACCESS_STEP")}
						</div>
						<div className="my-2">
							{displayMainRule(topo, "BOULDERS")}
						</div>
						<div className="my-2">
							{displayMainRule(topo, "TRACKS")}
						</div>
					</div>
				)}
			</div>
		);
	});
BuilderProgressIndicator.displayName = "BuilderProgressIndicator";
