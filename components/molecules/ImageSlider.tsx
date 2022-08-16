import { Quark, QuarkIter, watchDependencies } from "helpers/quarky";
import React, { Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { Img, Track } from "types";
import { TracksImage } from "./TracksImage"; // requires a loader
import { Portal } from "helpers/hooks";
import { Image } from "components/atoms";
import { SelectedBoulder, SelectedItem, selectImage } from "types/SelectedItems";

interface ImageSliderProps {
	images: Img[];
	tracks: QuarkIter<Quark<Track>>;
	selectedBoulder: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
	displayPhantomTracks?: boolean;
	modalable?: boolean;
}

const observerInitialOptions: IntersectionObserverInit = {
	root: null,
	rootMargin: "0px",
	threshold: 1.0,
};
const observerPortalOptions: IntersectionObserverInit = {
	root: null,
	rootMargin: "0px",
	threshold: 1.0,
};

export const ImageSlider: React.FC<ImageSliderProps> = watchDependencies(({
	displayPhantomTracks = false,
	modalable = true,
	...props
}: ImageSliderProps) => {
	const imgIdx = props.selectedBoulder.selectedImage
		? props.images.indexOf(props.selectedBoulder.selectedImage)
		: undefined;

	const selectedTrack = props.selectedBoulder.selectedTrack;
	console.log(selectedTrack);
	
	//For the IntersectionObserver management, see: https://www.rubensuet.com/intersectionObserver/
	const containerInitialRef = useRef<HTMLDivElement>(null);
	const slidesInitialRefs = useRef<HTMLDivElement[]>([]);
	const slidesPortalRefs = useRef<HTMLDivElement[]>([]);
	const addSlide = React.useCallback(
		(node: HTMLDivElement) => slidesInitialRefs.current.push(node),
		[]
	);
	const addSlidePortal = React.useCallback(
		(node: HTMLDivElement) => slidesPortalRefs.current.push(node),
		[]
	);
	const observerInitial = useRef<IntersectionObserver>(null);
	const observerPortal = useRef<IntersectionObserver>(null);

	// Allow to always know which image is the current one
	const handler = useCallback((
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) => {
		console.log(selectedTrack);
		// HERE IS THE BUG: selectedTrack should have the same value as at line 39...
		for (const entry of entries) {
			if (entry.intersectionRatio >= 1)
				selectImage(props.selectedBoulder, props.images[parseInt(entry.target.id.split("-")[1])], props.setSelectedItem);
		}
	}, [props.selectedBoulder, selectedTrack, props.images, props.setSelectedItem]);

	const getObserver = useCallback((
		ref: React.MutableRefObject<IntersectionObserver | null>,
		opts?: IntersectionObserverInit
	) => {
		let observer = ref.current;
		if (observer !== null) {
			return observer;
		}
		let newObserver = new IntersectionObserver(handler, opts);
		ref.current = newObserver;
		return newObserver;
	}, [handler]);

	// Bind observers to original slider (not in Portal) as soon as component is mounted
	useEffect(() => {
		if (props.images.length > 1) {
			if (observerInitial.current) observerInitial.current.disconnect();
			if (containerInitialRef.current)
				observerInitialOptions.root = containerInitialRef.current;
			const newObserver = getObserver(observerInitial, observerInitialOptions);
			for (const node of slidesInitialRefs.current) {
				newObserver.observe(node);
			}
			return () => observerInitial.current?.disconnect();
		}
	}, [props.images, getObserver, observerInitial, observerInitialOptions]);

	const [portalOpen, setPortalOpen] = useState(false);
	// Bind/unbind observers to Portal slider when portal opens/closes
	// And empy refs to portal slides when portal closes thanks to the trick slidesPortalRefs.current.length = 0;
	useEffect(() => {
		if (props.images.length > 1) {
			// Do it only if it is a gallery (more than one image)
			if (portalOpen) {
				slidesPortalRefs.current[imgIdx || 0].scrollIntoView();
				if (observerPortal.current) observerPortal.current.disconnect();
				const newObserver = getObserver(observerPortal, observerPortalOptions);
				for (const node of slidesPortalRefs.current) {
					newObserver.observe(node);
				}
				return () => observerPortal.current?.disconnect();
			} else {
				if (slidesPortalRefs.current.length > 0) {
					slidesInitialRefs.current[imgIdx || 0].scrollIntoView();
					slidesPortalRefs.current.length = 0;
				}
			}
		}
	}, [props.images, getObserver, portalOpen, observerPortal, observerPortalOptions]);

	// Change image when currentImage has changed from outside (for example by clicking on a track associated with a non-current image)
	useEffect(() => {
		if (props.selectedBoulder.selectedImage && imgIdx && slidesInitialRefs.current[imgIdx])
			slidesInitialRefs.current[imgIdx].scrollIntoView({ behavior: "smooth" });
	}, [props.selectedBoulder.selectedImage]);

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
		);
	};
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
			);
		else return getUniqueContent();
	};
	const getGalleryContent = (inPortal: boolean) => (
		<>
			<div
				ref={containerInitialRef}
				className="gallery relative flex w-full snap-x snap-mandatory gap-6 overflow-y-hidden"
			>
				{props.images?.map((img, idx) => {
					return (
						<div
							key={img.id}
							className="h-full w-full shrink-0 snap-center"
							ref={inPortal ? addSlidePortal : addSlide}
							id={inPortal ? "slideportal-" + idx : "slide-" + idx}
						>
							<TracksImage
								sizeHint="100vw"
								image={img}
								tracks={props.tracks}
								selectedBoulder={props.selectedBoulder}
								setSelectedItem={props.setSelectedItem}
								displayPhantomTracks={displayPhantomTracks}
								displayTracksDetails={!!props.selectedBoulder.selectedTrack}
								onImageClick={() => setPortalOpen(true)}
							/>
						</div>
					);
				})}
			</div>

			<div
				className={
					"absolute flex w-full justify-center " +
					(portalOpen ? "bottom-5" : "bottom-3")
				}
			>
				<div className="flex w-[90%] justify-center gap-4">
					{props.images?.map((img, idx) => (
						<div
							key={img.id}
							className={
								"h-3 w-3 rounded-full " +
								(imgIdx === idx
									? "border-2 border-main bg-white"
									: "bg-grey-light bg-opacity-50")
							}
							onClick={useCallback(() => {
								if (portalOpen)
									slidesPortalRefs.current[idx].scrollIntoView({
										behavior: "smooth",
									});
								else
									slidesInitialRefs.current[idx].scrollIntoView({
										behavior: "smooth",
									});
								selectImage(props.selectedBoulder, img, props.setSelectedItem);
							}, [props.selectedBoulder, img])}
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
			selectedBoulder={props.selectedBoulder}
			setSelectedItem={props.setSelectedItem}
			displayPhantomTracks={displayPhantomTracks}
			displayTracksDetails={!!props.selectedBoulder.selectedTrack}
			onImageClick={() => setPortalOpen(true)}
		/>
	);

	if (props.images.length > 0)
		// If there is at least one image
		return getPortalContent();
	// If there is no image
	else
		return <Image alt="default boulder" sizeHint="100vw" />;
});
