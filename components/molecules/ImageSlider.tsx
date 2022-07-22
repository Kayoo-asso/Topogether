import { Quark, QuarkIter, SelectQuarkNullable } from "helpers/quarky";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Image, Track } from "types";
import { TracksImage } from "./TracksImage"; // requires a loader
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

const observerInitialOptions: IntersectionObserverInit = {
	root: null,
	rootMargin: "0px",
	threshold: 1.0
}
const observerPortalOptions: IntersectionObserverInit = {
	root: null,
	rootMargin: "0px",
	threshold: 1.0
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
	displayPhantomTracks = false,
	modalable = true,
	...props
}: ImageSliderProps) => {
	const [currentIdx, setCurrentIdx] = useState<number>(props.imageToDisplayIdx);

	//For the IntersectionObserver management, see: https://www.rubensuet.com/intersectionObserver/
	const containerInitialRef = useRef<HTMLDivElement>(null);
	const slidesInitialRefs = useRef<HTMLDivElement[]>([]);
	const slidesPortalRefs = useRef<HTMLDivElement[]>([]);
	const addSlide = React.useCallback(
		(node: HTMLDivElement) => slidesInitialRefs.current.push(node)
	, []);
	const addSlidePortal = React.useCallback(
		(node: HTMLDivElement) => slidesPortalRefs.current.push(node)
	, []);
	const observerInitial = useRef<IntersectionObserver>(null);
	const observerPortal = useRef<IntersectionObserver>(null);
	
	// Allow to always know which image is the current one
	const handler = (
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) => {
		for (const entry of entries)  {
			if (entry.intersectionRatio >= 1) setCurrentIdx(parseInt(entry.target.id.split('-')[1]));
		}
	};
	const getObserver = (ref: React.MutableRefObject<IntersectionObserver | null>, opts?: IntersectionObserverInit) => {
		let observer = ref.current;
		if (observer !== null) {
			return observer;
		}
		let newObserver = new IntersectionObserver(handler, opts);
		ref.current = newObserver;
		return newObserver;
	};

	// Bind observers to original slider (not in Portal) as soon as component is mounted
	useEffect(() => {
		if (props.images.length > 1) {
			if (observerInitial.current) observerInitial.current.disconnect();
			if (containerInitialRef.current) observerInitialOptions.root = containerInitialRef.current;
			const newObserver = getObserver(observerInitial, observerInitialOptions);
			for  (const  node  of  slidesInitialRefs.current)  {
				newObserver.observe(node);
			}
			return () => {
				if (observerInitial.current) observerInitial.current.disconnect();
			}
		}
	}, [props.images, observerInitial, observerInitialOptions])

	const [portalOpen, setPortalOpen] = useState(false);
	// Bind/unbind observers to Portal slider when portal opens/closes
	// And empy refs to portal slides when portal closes thanks to the trick slidesPortalRefs.current.length = 0;
	useEffect(() => {
		if (props.images.length > 1) { // Do it only if it is a gallery (more than one image)
			if (portalOpen) {
				slidesPortalRefs.current[currentIdx].scrollIntoView();
				if (observerPortal.current) observerPortal.current.disconnect();
				const newObserver = getObserver(observerPortal, observerPortalOptions);
				for  (const  node  of  slidesPortalRefs.current)  {
					newObserver.observe(node);
				}
				return () => {
					if (observerPortal.current) observerPortal.current.disconnect();
				}
			}
			else {
				if (slidesPortalRefs.current.length > 0) {
					slidesInitialRefs.current[currentIdx].scrollIntoView();
					slidesPortalRefs.current.length = 0;
				}
			}
		}
	}, [props.images, portalOpen, observerPortal, observerPortalOptions]);


	const wrapPortal = (elts: ReactElement<any, any>) => {
		return (
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
		)
	}
	const getPortalContent = () => {	
		if (props.images.length > 1) // If it is a gallery of multiple images
			if (modalable) //If modalising is possible
				return (
					<>
						{getGalleryContent(false)}
						{wrapPortal(getGalleryContent(true))}
					</>
				);
			else return getGalleryContent(false);
		else if (modalable) // If it is a single image
			return (
				<>
					{getUniqueContent()}
					{wrapPortal(getUniqueContent())}
				</>
			)
		else return getUniqueContent();
	};
	const getGalleryContent = (inPortal: boolean) => (
		<>
			<div 
				ref={containerInitialRef}
				className="snap-x snap-mandatory flex w-full h-full overflow-y-hidden gap-6 relative gallery"
			>
				{props.images?.map((img, idx) => {
					return (
						<div 
							key={img.id}
							className='shrink-0 w-full h-full snap-center'
							ref={inPortal ? addSlidePortal : addSlide}
							id={inPortal ? 'slideportal-' + idx : 'slide-' + idx}
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
							/>
						</div>
					);
				})}
			</div>

			<div className={'absolute w-full flex justify-center ' + (portalOpen ? "bottom-5" : "bottom-3")}>
				<div className='w-[90%] flex gap-4 justify-center'>
					{props.images?.map((img, idx) => (
						<div 
							key={img.id}
							className={'rounded-full w-3 h-3 ' + (currentIdx === idx ? 'bg-white border-main border-2' : 'bg-grey-light bg-opacity-50')}
							onClick={() => {
								if (portalOpen) slidesPortalRefs.current[idx].scrollIntoView({ behavior: "smooth" });
								else slidesInitialRefs.current[idx].scrollIntoView({ behavior: "smooth" });
								setCurrentIdx(idx);
							}}
						></div>
					))}
				</div>
			</div>
		</>
	);
	const getUniqueContent = () => (
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
	)

	
	if (props.images.length > 0) // If there is at least one image
		return getPortalContent();
	else // If there is no image
		return (
			<CFImage
				alt="default boulder"
				sizeHint="100vw"
				modalable={false}
			/>
		);
};
