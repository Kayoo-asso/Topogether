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
import { useSelectStore } from "components/pages/selectStore";

interface ImageSliderProps {
	images: Img[];
	tracks: QuarkIter<Quark<Track>>;
	displayPhantomTracks?: boolean;
	modalable?: boolean;
}

export const ImageSlider: React.FC<ImageSliderProps> = watchDependencies(
	({
		displayPhantomTracks = false,
		modalable = true,
		...props
	}: ImageSliderProps) => {
		const selectedTrack = useSelectStore(s => s.item.type === 'boulder' && s.item.selectedTrack || undefined);
		const selectedImage = useSelectStore(s => s.item.type === 'boulder' && s.item.selectedImage || undefined);
		const selectImage = useSelectStore(s => s.select.image);
		const [portalOpen, setPortalOpen] = useState(false);
		const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
			null
		);
		const [portalRef, setPortalRef] = useState<HTMLDivElement | null>(null);

		// This is very hacky, but makes the UX smoother
		// When this component mounts, or when the portal mounts,
		// we should instantly scroll to the image we want to display.
		// After that, we can scroll smoothly
		const scrollSliderInstantly = useRef(true);
		const scrollPortalInstantly = useRef(true);

		// If the selected image changes externally, scroll the image into view
		useEffect(() => {
			if (selectedImage) {
				if (containerRef) {
					let behavior: ScrollBehavior = "smooth";
					// For some reason, "smooth" prevents scrolling the main container
					// in the background when the portal is open
					if (portalOpen || scrollSliderInstantly.current) {
						behavior = "auto";
						scrollSliderInstantly.current = false;
					}
					for (const child of containerRef.children) {
						const imageId = (child as any).dataset.imageId;
						if (imageId === selectedImage.id) {
							child.scrollIntoView({
								// Without this, this useEffect messes up the Slideover on opening on mobile
								block: "end",
								behavior,
							});
						}
					}
				}

				if (portalRef) {
					let behavior: ScrollBehavior = "smooth";
					if (scrollPortalInstantly.current) {
						behavior = "auto";
						scrollPortalInstantly.current = false;
					}
					for (const child of portalRef.children) {
						const imageId = (child as any).dataset.imageId;
						if (imageId === selectedImage.id) {
							child.scrollIntoView({
								block: "end",
								behavior,
							});
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
			let skipInitialization = true;
			const callback: IntersectionObserverCallback = (entries) => {
				if (skipInitialization) {
					skipInitialization = false;
					return;
				}
				const entry = entries.find((x) => x.intersectionRatio === 1);
				if (!entry) return;
				const id = (entry.target as any).dataset.imageId;

				const img = props.images.find((i) => i.id === id)!;
				selectImage(img);
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

		useEffect(() => {
			// Avoid having two observer at the same time
			// The portal takes priority
			if (portalRef) {
				// Don't forget to return the cleanup!!
				return setupObserver(portalRef);
			} else if (containerRef) {
				return setupObserver(containerRef);
			}
		}, [setupObserver, containerRef, portalRef]);

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
									displayPhantomTracks={displayPhantomTracks}
									displayTracksDetails={!!selectedTrack}
									onImageClick={() => setPortalOpen(modalable)}
								/>
							</div>
						);
					})}
				</div>

				<div
					className={
						"absolute flex w-full justify-center " +
						(inPortal ? "bottom-5" : "bottom-2")
					}
				>
					<div className="flex w-[90%] justify-center gap-4">
						{props.images?.map((img) => (
							<div
								key={img.id}
								className={
									"h-2 w-2 rounded-full " +
									(img.id === selectedImage?.id
										? "border-2 border-main bg-white"
										: "bg-grey-light bg-opacity-50")
								}
								onClick={() => selectImage(img)}
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
				displayPhantomTracks={displayPhantomTracks}
				displayTracksDetails={!!selectedTrack}
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
