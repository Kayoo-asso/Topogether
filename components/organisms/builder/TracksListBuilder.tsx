import React, { useCallback } from "react";
import { Boulder, Grade, Track, gradeToLightGrade } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { useSession } from "helpers/services";
import DrawIcon from "assets/icons/draw.svg";
import { createTrack } from "helpers/builder";
import { staticUrl } from "helpers/constants";
import { TrackForm } from "../form/TrackForm";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { useModal } from "helpers/hooks/useModal";
import { GradeCircle } from "components/atoms/GradeCircle";
import { useDrawerStore } from "components/store/drawerStore";

const getTextGradeColorClass = (g: Grade | undefined) => {
	if (!g) return "text-grey-light";
	else {
		const lightGrade = gradeToLightGrade(g);
		switch (lightGrade) {
			case 3: return "text-grade-3"; break;
			case 4: return "text-grade-4"; break;
			case 5: return "text-grade-5"; break;
			case 6: return "text-grade-6"; break;
			case 7: return "text-grade-7"; break;
			case 8: return "text-grade-8"; break;
			case 9: return "text-grade-9"; break;
            case 'P': return "text-grey-light"; break;
		}
	}
};

interface TracksListBuilderProps {
	onAddImage?: () => void;
}

export const TracksListBuilder: React.FC<TracksListBuilderProps> =
	watchDependencies((props: TracksListBuilderProps) => {
		const session = useSession();
		if (!session) return null;
		const bp = useBreakpoint();

		const openDrawer = useDrawerStore(d => d.openDrawer);
		const openGradeSelector = useDrawerStore(d => d.openGradeSelector);
		const selectTool = useDrawerStore(d => d.selectTool);
		
		const select = useSelectStore(s => s.select);
		const flush = useSelectStore(s => s.flush);
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const selectedTrack = selectedBoulder.selectedTrack;

		const boulder = selectedBoulder.value()
		const tracks = boulder.tracks
			.quarks()
			.toArray()
			.sort((t1, t2) => t1().index - t2().index);

		const selectTrack = (tQuark: Quark<Track>, bQuark: Quark<Boulder>, sTrack?: Quark<Track>) => {
			if (sTrack && sTrack().id === tQuark().id) flush.track();
			else select.track(tQuark, bQuark);
			if (bp === 'desktop') {
				selectTool('LINE_DRAWER');
				openDrawer();
			}
		}

		const [ModalAddImage, showModalAddImage] = useModal();

		return (
			<>
				<div className="w-full border-t border-grey-light">
					{tracks.map((trackQuark) => {
						const track = trackQuark();
						const grade = gradeToLightGrade(track.grade);
						return (
							<div
								key={track.id}
								className={
									"flex md:cursor-pointer flex-col border-b border-grey-light px-5 py-5 md:py-3 md:hover:bg-grey-superlight" +
									(!selectedTrack ? '' :
										selectedTrack().id !== track.id ? 
										" opacity-40" : "")
								}
								onClick={() => selectTrack(trackQuark, selectedBoulder.value, selectedTrack)}

							>
								<div className="flex w-full flex-row items-center">
									<GradeCircle
										grade={grade}
										className="md:cursor-pointer"
										content={(track.index + 1).toString()}
										onClick={() => selectTrack(trackQuark, selectedBoulder.value,  selectedTrack)}
									/>

									{track.grade && (
										<div
											className={`ktext-subtitle ml-3 text-right ${getTextGradeColorClass(grade.toString() as Grade)}`}
										>
											{track.grade}
										</div>
									)}
									<div className="ml-4 flex w-3/4 flex-col">
										<span className="ktext-base">{track.name}</span>
										{track.isTraverse && (
											<div className="ktext-subtext">Traversée</div>
										)}
										{track.isSittingStart && (
											<div className="ktext-subtext">Départ assis</div>
										)}
									</div>

									<div className='md:hidden'>
										<button
											onClick={(e) => {
												e.stopPropagation();
												select.track(trackQuark, selectedBoulder.value);
												openDrawer();
											}}
										>
											<DrawIcon className="h-6 w-6 stroke-main" />
										</button>
									</div>
								</div>
								{selectedTrack && selectedTrack().id === track.id && bp === "mobile" && (
									<TrackForm className="mt-8" />
								)}
							</div>
						);
					})}

					<div
						className={
							"border-b border-grey-light px-5 py-5 md:py-3 " +
							(boulder.images.length > 0
								? "md:cursor-pointer text-grey-medium hover:bg-grey-superlight"
								: "cursor-default text-grey-light")
						}
						onClick={() => {
							if (boulder.images.length > 0) {
								select.track(createTrack(boulder, session!.id), selectedBoulder.value);
								openGradeSelector();
								openDrawer();
								
							} else showModalAddImage();
						}}
					>
						<span className="ktext-subtitle ml-2 mr-5 text-xl">+</span>{" "}
						<span className="ktext-subtitle">Nouvelle voie</span>
					</div>
				</div>

				<ModalAddImage
					buttonText="Ajouter une image"
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={props.onAddImage}
				>
					Vous devez ajouter une première image pour créer une voie.
				</ModalAddImage>
			</>
		);
	});

TracksListBuilder.displayName = "TracksListBuilder";
