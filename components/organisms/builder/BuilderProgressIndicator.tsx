import React, { useEffect, useRef, useState } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo } from "types";
import Clear from "assets/icons/clear.svg";
import Checked from "assets/icons/checked.svg";
import { Rule, validateRule, rulesText } from "helpers/topo";

interface BuilderProgressIndicatorProps {
	topo: Quark<Topo>;
	progress: number;
	displayInfosTopo: () => void;
	displayInfosApproach: () => void;
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
		const [open, setOpen] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

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
					className="ktext-light flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white text-white"
				>
					{props.progress}%
				</div>
				{open && (
					<div
						className={`absolute right-5 top-[7%] z-1000 flex w-[90%] flex-col rounded bg-white p-5 shadow md:right-auto md:-ml-5 md:w-[23%] md:min-w-[340px]`}
					>
						<div
							className="my-2 cursor-pointer"
							onClick={() => {
								props.displayInfosTopo();
								setOpen(false);
							}}
						>
							{displayMainRule(props.topo(), "INFOS_TOPO")}
							{displayRule(props.topo(), "TOPO_IMAGE")}
							{displayRule(props.topo(), "DESCRIPTION")}
							{displayRule(props.topo(), "ROCK_TYPE")}
							{displayRule(props.topo(), "ALTITUDE")}
						</div>
						<div className="my-2">
							{displayMainRule(props.topo(), "PARKINGS")}
						</div>
						<div
							className="my-2 cursor-pointer"
							onClick={() => {
								props.displayInfosApproach();
								setOpen(false);
							}}
						>
							{displayMainRule(props.topo(), "INFOS_ACCESS")}
							{displayRule(props.topo(), "ACCESS_DURATION")}
							{displayRule(props.topo(), "ACCESS_DIFFICULTY")}
							{displayRule(props.topo(), "ACCESS_STEP")}
						</div>
						<div className="my-2">
							{displayMainRule(props.topo(), "BOULDERS")}
						</div>
						<div className="my-2">
							{displayMainRule(props.topo(), "TRACKS")}
						</div>
					</div>
				)}
			</div>
		);
	});
BuilderProgressIndicator.displayName = "BuilderProgressIndicator";
