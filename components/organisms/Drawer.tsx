import React, { useCallback, useEffect } from "react";
import {
	Img,
	LinearRing,
	PointEnum,
	Position,
	Track,
} from "types";
import {
	QuarkIter,
	watchDependencies,
} from "helpers/quarky";
import { v4 } from "uuid";
import { staticUrl } from "helpers/constants";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { Portal, useModal } from "helpers/hooks/useModal";
import { TracksImage } from "components/molecules/TracksImage";
import { Toolbar } from "components/molecules/drawer/Toolbar";
import { useDrawerStore } from "components/store/drawerStore";
import { Image } from "components/atoms/Image";

interface DrawerProps {}

export const Drawer: React.FC<DrawerProps> = watchDependencies(
	(props: DrawerProps) => {
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		if (!selectedBoulder.selectedTrack) throw new Error('Drawer opened without any track');
		const selectedTrack: Track = selectedBoulder.selectedTrack();
		const image = selectedBoulder.selectedImage || selectedBoulder.value().images[0];
		const select = useSelectStore(s => s.select);

		const selectedTool = useDrawerStore(d => d.selectedTool);
		const selectTool = useDrawerStore(d => d.selectTool);
		const isOtherTracksDisplayed = useDrawerStore(d => d.isOtherTracksDisplayed);

		const [ModalClear, showModalClear] = useModal();
		
		const addPointToLine = useCallback((pos: Position, image: Img) => {
			let lineQuark = selectedTrack.lines.findQuark(
				(l) => l.imageId === image.id
			);
			if (!lineQuark) {
				selectedTrack.lines.push({
					id: v4(),
					index: selectedTrack.lines.length,
					imageId: image.id,
					points: [],
				});
				lineQuark = selectedTrack.lines.findQuark(
					(l) => l.imageId === image.id
				)!;
			}

			const line = lineQuark();
			switch (selectedTool) {
				case "LINE_DRAWER":
					line.points.push(pos);
					lineQuark.set({
						...line,
						points: line.points,
					});
					break;
				case "HAND_DEPARTURE_DRAWER":
					lineQuark.set({
						...line,
						hand1: line.hand2,
						hand2: pos,
					});
					break;
				case "FOOT_DEPARTURE_DRAWER":
					lineQuark.set({
						...line,
						foot1: line.foot2,
						foot2: pos,
					});
					break;
				case "FORBIDDEN_AREA_DRAWER":
					const newForbiddenPoints = line.forbidden || [];
					newForbiddenPoints.push(constructArea(pos));
					lineQuark.set({
						...line,
						forbidden: newForbiddenPoints,
					});
					break;
			}
		}, [selectedTool, image, selectedTrack.lines]);

		const deletePointToLine = useCallback(
			(pointType: PointEnum, index: number) => {
				const newLine = selectedTrack.lines.quarkAt(0); //TODO : change the quarkAt when it will be possible to have multiple lines for a track
				if (newLine) {
					const line = newLine();
					switch (pointType) {
						case "LINE_POINT":
							if (line.points) {
								if (index === -1) line.points.pop();
								newLine.set({
									...line,
									points:
										index === -1
											? [...line.points]
											: [
													...line.points.slice(0, index),
													...line.points.slice(index + 1),
											  ],
								});
							}
							break;
						case "HAND_DEPARTURE_POINT":
							newLine.set({
								...line,
								hand1: index === 0 ? undefined : line.hand1,
								hand2: index === 1 || index === -1 ? undefined : line.hand2,
							});
							break;
						case "FOOT_DEPARTURE_POINT":
							newLine.set({
								...line,
								foot1: index === 0 ? undefined : line.foot1,
								foot2: index === 1 || index === -1 ? undefined : line.foot2,
							});
							break;
						case "FORBIDDEN_AREA_POINT":
							if (line.forbidden) {
								if (index === -1) line.forbidden.pop();
								newLine.set({
									...line,
									forbidden:
										index === -1
											? [...line.forbidden]
											: [
													...line.forbidden.slice(0, index),
													...line.forbidden.slice(index + 1),
											  ],
								});
							}
							break;
					}
				}
			},
			[selectedTrack.lines]
		);
		const handleEraserClick = useCallback((pointType, index) => {
			if (selectedTool === "ERASER")
				deletePointToLine(pointType, index);
		}, [selectedTool]);
		const rewind = () => {
			const pointType: PointEnum | undefined =
				selectedTool === "LINE_DRAWER"
					? "LINE_POINT"
					: selectedTool === "FOOT_DEPARTURE_DRAWER"
					? "FOOT_DEPARTURE_POINT"
					: selectedTool === "HAND_DEPARTURE_DRAWER"
					? "HAND_DEPARTURE_POINT"
					: selectedTool === "FORBIDDEN_AREA_DRAWER"
					? "FORBIDDEN_AREA_POINT"
					: undefined;
			if (pointType) deletePointToLine(pointType, -1);
		};

		const constructArea = (pos: Position): LinearRing => {
			const size = 450;
			return [
				[pos[0] - size, pos[1] - size],
				[pos[0] - size, pos[1] + size],
				[pos[0] + size, pos[1] + size],
				[pos[0] + size, pos[1] - size],
			];
		};

		useEffect(() => {
			const handleKeydown = (e: KeyboardEvent) => {
				if (e.ctrlKey && e.key === "z") rewind();
				else if (e.code === "Escape") {
					selectTool("LINE_DRAWER");
					e.stopPropagation();
				}
			};
			window.addEventListener("keydown", handleKeydown);
			return () => window.removeEventListener("keydown", handleKeydown);
		}, [selectedTrack]);

		return (
			<>
				{/* Here we position absolutely, using hardcoded 7vh for the header
					TODO: encode the size of header / toolbar / etc... as units Tailwind config?
				*/}
				<Portal open>
					<div className="absolute left-0 top-0 md:top-[7vh] z-[600] h-full md:h-contentPlusShell w-full md:w-[calc(100%-300px)]">
						{(!selectedBoulder.selectedImage && selectedBoulder.value().images.length > 1) && 
							<div className="flex flex-col gap-6 h-full p-8 md:p-12 bg-black b-opacity-90 overflow-scroll hide-scrollbar">
								<div className="text-white ktext-label">Sélectionner l'image sur laquelle réaliser le tracé</div>
								<div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
									{selectedBoulder.value().images.map(img => (
										<div key={img.id} className='md:cursor-pointer'>
											<Image 
												image={img}
												alt="photo of rock"
												sizeHint={'25vw'}
												objectFit="cover"
												className="max-h-[15vh] md:max-h-[20vh] rounded-lg border-4 border-main border-opacity-0 hover:border-opacity-100"
												onClick={() => select.image(img)}
											/>
										</div>
									))}
								</div>
							</div>
						}

						{/* Same, we know absolute size, since both header + toolbar are 7vh each */}
						{(selectedBoulder.selectedImage || selectedBoulder.value().images.length === 1) &&
							<>
								<div className="b-opacity-90 flex h-[90vh] md:h-[84vh] bg-black">
									<TracksImage
										sizeHint="100vw"
										objectFit="contain"
										image={image}
										tracks={
											isOtherTracksDisplayed
												? selectedBoulder.value().tracks.quarks()
												: new QuarkIter([selectedBoulder.selectedTrack])
										}
										editable
										allowDoubleTapZoom={false}
										displayTracksDetails
										onImageClick={(pos) => {
											addPointToLine(pos, image!);
										}}
										onPointClick={handleEraserClick}
									/>
								</div>

								<Toolbar
									onClear={showModalClear}
									onRewind={rewind}
								/>
							</>
						}
					</div>
				</Portal>

				<ModalClear
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={useCallback(() => {
						selectedTrack.lines.removeAll((x) => x.imageId === image?.id);
					}, [selectedTrack, selectedTrack.lines])}
				>
					Vous êtes sur le point de supprimer l'ensemble du tracé. Voulez-vous continuer ?
				</ModalClear>
			</>
		);
	}
);

Drawer.displayName = "Drawer";
