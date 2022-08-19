import React, { useCallback, useEffect, useState } from "react";
import {
	DrawerToolEnum,
	LinearRing,
	PointEnum,
	Position,
	Track,
} from "types";
import { Toolbar, TracksImage } from "components";
import {
	QuarkIter,
	watchDependencies,
} from "helpers/quarky";
import { v4 } from "uuid";
import { staticUrl } from "helpers/constants";
import { useModal, Portal } from "helpers/hooks";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";

interface DrawerProps {
	onValidate?: () => void;
}

export const Drawer: React.FC<DrawerProps> = watchDependencies(
	(props: DrawerProps) => {
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		if (!selectedBoulder.selectedTrack) throw new Error('Drawer opened without any track');
		if (!selectedBoulder.selectedImage) throw new Error("Drawer opened without any image");
		const selectedTrack: Track = selectedBoulder.selectedTrack();
		const image = selectedBoulder.selectedImage;	

		const [selectedTool, setSelectedTool] =
			useState<DrawerToolEnum>("LINE_DRAWER");
		const [displayOtherTracks, setDisplayOtherTracks] = useState(false);
		const [ModalClear, showModalClear] = useModal();
		
		const addPointToLine = useCallback((pos: Position) => {
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
		}, [selectedTrack.lines]);

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
					setSelectedTool("LINE_DRAWER");
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
					<div className="absolute coucou left-0 top-0 md:top-[7vh] z-[600] h-full md:h-contentPlusShell w-full md:w-[calc(100%-600px)]">
						{/* Same, we know absolute size, since both header + toolbar are 7vh each */}
						<div className="b-opacity-90 flex h-[90vh] md:h-[84vh] bg-black">
							<TracksImage
								sizeHint="100vw"
								objectFit="contain"
								image={image}
								tracks={
									displayOtherTracks
										? selectedBoulder.value().tracks.quarks()
										: new QuarkIter([selectedBoulder.selectedTrack])
								}
								currentTool={selectedTool}
								editable
								allowDoubleTapZoom={false}
								displayTracksDetails
								onImageClick={(pos) => {
									addPointToLine(pos);
								}}
								onPointClick={useCallback((pointType, index) => {
									if (selectedTool === "ERASER")
										deletePointToLine(pointType, index);
								}, [selectedTool])}
							/>
						</div>

						<Toolbar
							selectedTool={selectedTool}
							displayOtherTracks={displayOtherTracks}
							grade={selectedTrack.grade}
							onToolSelect={(tool) => setSelectedTool(tool)}
							onGradeSelect={useCallback((grade) => {
								selectedBoulder.selectedTrack!.set({
									...selectedTrack,
									grade: grade,
								});
							}, [selectedBoulder, selectedTrack])}
							onClear={showModalClear}
							onRewind={rewind}
							onOtherTracks={() => setDisplayOtherTracks(!displayOtherTracks)}
							onValidate={props.onValidate}
						/>
					</div>
				</Portal>

				<ModalClear
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={useCallback(() => {
						selectedTrack.lines.removeAll((x) => x.imageId === image.id);
					}, [selectedTrack, selectedTrack.lines])}
				>
					Vous êtes sur le point de supprimer l'ensemble du tracé. Voulez-vous continuer ?
				</ModalClear>
			</>
		);
	}
);

Drawer.displayName = "Drawer";
