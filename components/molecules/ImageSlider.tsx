import { Quark, QuarkIter, SelectQuarkNullable } from "helpers/quarky";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Image, Track } from "types";
import { TracksImage } from "./TracksImage";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Portal } from "helpers/hooks";
import { CFImage } from "components/atoms";

interface ImageSliderProps {
	images: Image[];
	imageToDisplayIdx: number;
	tracks: QuarkIter<Quark<Track>>;
	selectedTrack?: SelectQuarkNullable<Track>;
	displayPhantomTracks?: boolean;
	modalable?: boolean;
	onChange?: (idx: number, item: React.ReactNode) => void;
}

const options = {
	root: null,
	rootMargin: "0px",
	threshold: 1.0
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
	displayPhantomTracks = false,
	modalable = true,
	...props
}: ImageSliderProps) => {
	const [isZooming, setIsZooming] = useState(false);
	const [currentIdx, setCurrentIdx] = useState<number>(props.imageToDisplayIdx);

	//For the IntersectionObserver management, see: https://www.rubensuet.com/intersectionObserver/
	const slidesRefs = useRef<HTMLDivElement[]>([]);
	const addNode = React.useCallback(
		(node: HTMLDivElement) => slidesRefs.current.push(node)
	, []);
	const observer = useRef<IntersectionObserver>(null);

	const handler = (
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) => {
		for (const entry of entries)  {
			if (entry.intersectionRatio >= 1) setCurrentIdx(parseInt(entry.target.id.split('-')[1]));
		}
	};
	const getObserver = (ref: React.MutableRefObject<IntersectionObserver | null>) => {
		let observer = ref.current;
		if (observer !== null) {
			return observer;
		}
		let newObserver = new IntersectionObserver(handler, options);
		ref.current = newObserver;
		return newObserver;
	};
	useEffect(() => {
		if (observer.current) observer.current.disconnect();

		const newObserver = getObserver(observer);
		for  (const  node  of  slidesRefs.current)  {
			newObserver.observe(node);
		}

		return () => {
			if (observer.current) observer.current.disconnect();
		}
	}, [observer, options])

	const [portalOpen, setPortalOpen] = useState(false);
	const wrapPortal = (elts: ReactElement<any, any>) => {
		if (modalable && props.images) {
			return (
				<>
					{elts}
					<Portal open={portalOpen}>
						<div
							className="absolute top-0 left-0 z-full flex h-screen w-screen bg-black bg-opacity-80"
							onClick={(e) => {
								const eltUnder = e.target as EventTarget & SVGSVGElement;
								if (eltUnder.nodeName === "svg") setPortalOpen(false);
							}}
						>
							{elts}
						</div>
					</Portal>
				</>
			);
		} else return elts;
	};

	if (props.images.length > 1)
		return (
			<>
			{wrapPortal(
				<>
					<div 
						className={"snap-x snap-mandatory flex w-full h-full overflow-y-hidden gap-6 relative gallery" + (isZooming ? " overflow-x-hidden" : "")}
					>
						{props.images?.map((img, idx) => {
							return (
								<div 
									key={img.id}
									className={'shrink-0 w-full h-full snap-center ' + ((idx > 0 && idx < props.images.length - 1) ? ' first:pl-8 last:pr-8' : '')}
									ref={addNode}
									id={'slide-' + idx}
								>
									<TracksImage	
										sizeHint="100vw"
										image={img}
										tracks={props.tracks}
										selectedTrack={props.selectedTrack}
										displayPhantomTracks={displayPhantomTracks}
										displayTracksDetails={
											props.selectedTrack && !!props.selectedTrack()?.id
										}
										onImageClick={() => setPortalOpen(true)}
										onZoomStart={() => setIsZooming(true)}
										onZoomEnd={() => setIsZooming(false)}
									/>
								</div>
							);
						})}
					</div>	
				</>
			)}
			
			<div className='absolute w-full flex bottom-3 justify-center'>
				<div className='w-[90%] flex gap-4 justify-center'>
					{props.images?.map((img, idx) => (
						<div 
							className={'rounded-full w-3 h-3 ' + (currentIdx === idx ? 'bg-white border-main border-2' : 'bg-grey-light bg-opacity-50')}
							onClick={() => {
								slidesRefs.current[idx].scrollIntoView({ behavior: "smooth" });
								setCurrentIdx(idx);
							}}
						></div>
					))}
				</div>
			</div>
		</>
		);
	else if (props.images.length === 1)
		return wrapPortal(
			<TracksImage
				key={props.images[0].id}
				sizeHint="100vw"
				image={props.images[0]}
				tracks={props.tracks}
				selectedTrack={props.selectedTrack}
				displayPhantomTracks={displayPhantomTracks}
				displayTracksDetails={
					props.selectedTrack && !!props.selectedTrack()?.id
				}
				onImageClick={() => setPortalOpen(true)}
			/>
		);
	else
		return (
			<CFImage
				alt="default boulder"
				sizeHint="100vw"
				modalable={false}
			/>
		);
};
