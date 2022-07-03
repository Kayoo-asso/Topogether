import { api } from "helpers/services";
import React, { ReactNode, useEffect, useState } from "react";
import { Boulder, LightTopo, Topo } from "types";
import { DownloadButton, LikeButton, Show } from "..";

interface SlideagainstRightDesktopProps {
	open?: boolean;
	secondary?: boolean;
	displayLikeButton?: boolean;
	displayDlButton?: boolean;
	className?: string;
	item?: Boulder | Topo | LightTopo;
	onClose?: () => void;
	children?: ReactNode;
}

const isTopo = (item: Boulder | Topo | LightTopo): item is Topo =>
	(item as Topo).rockTypes !== undefined;

export const SlideagainstRightDesktop: React.FC<
	SlideagainstRightDesktopProps
> = ({
	open = false,
	secondary = false,
	...props
}: SlideagainstRightDesktopProps) => {
	const size = 300;

	const [offset, setOffset] = useState<number>(0);
	useEffect(() => {
		if (open) {
			setOffset(size + (secondary ? size : 0));
		} else {
			setOffset(0);
		}
		// window.setTimeout(() => setOffset(open ? size : 0), 1);
	}, [open]);

	return (
		<div
			className={`absolute top-0 flex flex-col w-[300px] h-full border-l py-5 bg-white border-grey-medium
                ${secondary ? "z-200" : "z-300"}
                ${props.className ? props.className : ""}`}
			style={{
				// use `right` positioning, to tell the DOM this document should be outside the page
				// (`left: 100%` and `right: 0` does not work, it grows the div containing this one)
				right: `-${size}px`,
				transform: `translate(-${offset}px)`,
				transition: "transform 0.15s ease-in-out",
			}}
		>
			<div className="flex flex-row justify-between h-[5%] px-5">
				<div className="flex flex-row w-[70px] justify-between">
					<Show when={() => props.item}>
						{(item) => (
							<>
								{props.displayLikeButton && <LikeButton liked={item.liked} />}
								{props.displayDlButton && isTopo(item) && (
									<DownloadButton topo={item} />
								)}
							</>
						)}
					</Show>
				</div>
				<span
					className="cursor-pointer text-main ktext-base"
					onClick={() => {
						setOffset(0);
						window.setTimeout(() => props.onClose && props.onClose(), 150);
					}}
				>
					Terminé
				</span>
			</div>

			<div className="flex-1 relative overflow-auto">{props.children}</div>
		</div>
	);
};
