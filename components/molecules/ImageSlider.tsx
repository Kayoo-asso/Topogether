import { Quark, QuarkIter, watchDependencies } from "helpers/quarky";
import React, {
	Dispatch,
	ReactElement,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Img, Track } from "types";
import { TracksImage } from "./TracksImage"; // requires a loader
import { Portal } from "helpers/hooks";
import { Image } from "components/atoms";
import {
	SelectedBoulder,
	SelectedItem,
	selectImage,
} from "types/SelectedItems";

interface ImageSliderProps {
	images: Img[];
	tracks: QuarkIter<Quark<Track>>;
	selectedBoulder: SelectedBoulder;
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
	displayPhantomTracks?: boolean;
	modalable?: boolean;
}

export const ImageSlider: React.FC<ImageSliderProps> = watchDependencies(
	({
		displayPhantomTracks = false,
		modalable = true,
		...props
	}: ImageSliderProps) => {
		const selectedImage = props.selectedBoulder.selectedImage;
		const [portalOpen, setPortalOpen] = useState(false);
		const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
			null
		);
		const [portalRef, setPortalRef] = useState<HTMLDivElement | null>(null);

		// If the selected image changes externally, scroll the image into view
		useEffect(() => {
			if (selectedImage) {
				// Same logic for both containers
				if (containerRef) {
					for (const child of containerRef.children) {
						const imageId = (child as any).dataset.imageId;
						if (imageId === selectedImage.id) {
							child.scrollIntoView({
								// For some reason, "smooth" prevents scrolling the main container
								// in the background when the portal is open
								// behavior: "smooth",
								block: "end",
								inline: "nearest",
							});
						}
					}
				}

				if (portalRef) {
					for (const child of portalRef.children) {
						const imageId = (child as any).dataset.imageId;
						if (imageId === selectedImage.id) {
							child.scrollIntoView({ behavior: "smooth" });
						}
					}
				}
			}
		}, [containerRef, portalRef, selectedImage]);

		const setupObserver = useCallback((elt: HTMLDivElement) => {
			const options: IntersectionObserverInit = {
				root: elt,
				rootMargin: "0px",
				threshold: 1.0,
			};
			const callback: IntersectionObserverCallback = (entries) => {
				const entry = entries.find((x) => x.intersectionRatio === 1);
				if (!entry) return;
				const id = (entry.target as any).dataset.imageId;

				const img = props.images.find((i) => i.id === id)!;
				selectImage(img, props.setSelectedItem);
			};
			const observer = new IntersectionObserver(callback, options);
			// The children of the container are the images.
			// This useEffect reruns every time the images change, so we'll always have
			// an IntersectionObserver hooked up to the latest images.
			// Somewhat brittle though, so double check this is working correctly.
			for (const child of elt.children) {
				observer.observe(child);
			}

			return () => observer.disconnect();
		}, []);

		// Slider IntersectionObserver
		useEffect(() => {
			if (containerRef) {
				// Don't forget to return the cleanup!!
				return setupObserver(containerRef);
			}
			// We need containerRef.current in dependencies, so that this effect runs
			// when the ref is set
		}, [setupObserver, containerRef]);

		useEffect(() => {
			if (portalRef) {
				// Don't forget to return the cleanup!!
				return setupObserver(portalRef);
			}
			// We need portalRef.current in dependencies, so that this effect runs
			// when the ref is set (when the portal opens)
		}, [setupObserver, portalRef]);

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
			if (props.images.length > 1) {
				// If it is a gallery of multiple images
				return (
					<>
						{getGalleryContent(false)}
						{portalOpen && wrapPortal(getGalleryContent(true))}
					</>
				);
			} else {
				// If it is a single image
				return (
					<>
						{getUniqueContent()}
						{portalOpen && wrapPortal(getUniqueContent())}
					</>
				);
			}
		};
		const getGalleryContent = (inPortal: boolean) => (
			<>
				<div
					ref={inPortal ? setPortalRef : setContainerRef}
					className="gallery relative flex w-full snap-x snap-mandatory gap-6 overflow-y-scroll"
				>
					{props.images?.map((img) => {
						return (
							<div
								key={img.id}
								className="h-full w-full shrink-0 snap-center"
								data-image-id={img.id}
							>
								<TracksImage
									sizeHint="100vw"
									image={img}
									tracks={props.tracks}
									selectedBoulder={props.selectedBoulder}
									setSelectedItem={props.setSelectedItem}
									displayPhantomTracks={displayPhantomTracks}
									displayTracksDetails={!!props.selectedBoulder.selectedTrack}
									onImageClick={() => setPortalOpen(modalable)}
								/>
							</div>
						);
					})}
				</div>

				<div
					className={
						"absolute flex w-full justify-center " +
						(inPortal ? "bottom-5" : "bottom-3")
					}
				>
					<div className="flex w-[90%] justify-center gap-4">
						{props.images?.map((img) => (
							<div
								key={img.id}
								className={
									"h-3 w-3 rounded-full " +
									(img.id === selectedImage?.id
										? "border-2 border-main bg-white"
										: "bg-grey-light bg-opacity-50")
								}
								onClick={() => selectImage(img, props.setSelectedItem)}
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
				onImageClick={() => setPortalOpen(modalable)}
			/>
		);

		if (props.images.length > 0)
			// If there is at least one image
			return getPortalContent();
		// If there is no image
		else return <Image alt="default boulder" sizeHint="100vw" />;
	}
);
