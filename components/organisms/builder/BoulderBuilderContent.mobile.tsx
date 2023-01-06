import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { GradeScale, ImageSlider } from "components";
import { Topo } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { BoulderForm } from "..";
import { Image } from "components/atoms/Image";
import { ImageInput } from "components/molecules";
import { Button } from "components/atoms";
import { useBreakpoint, useModal } from "helpers/hooks";
import { staticUrl } from "helpers/constants";
import { deleteBoulder } from "helpers/builder";
import { TracksListBuilder } from "./TracksListBuilder";
import { Drawer } from "../Drawer";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";

interface BoulderBuilderContentMobileProps {
	full: boolean,
	topo: Quark<Topo>;
}

export const BoulderBuilderContentMobile: React.FC<BoulderBuilderContentMobileProps> =
	watchDependencies((props: BoulderBuilderContentMobileProps) => {
		const breakpoint = useBreakpoint();
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value();
		const select = useSelectStore(s => s.select);
		const flush = useSelectStore(s => s.flush);

		const [displayDrawer, setDisplayDrawer] = useState(false);
		const [ModalDelete, showModalDelete] = useModal();

		const [trackTab, setTrackTab] = useState(true);

		return (
			<>
				{/* BOULDER IMAGE */}
				{props.full && (
					<div className="relative flex max-h-[40%] h-[40%] w-full overflow-hidden rounded-t-lg bg-dark">
						<ImageSlider
							images={boulder.images}
							tracks={boulder.tracks.quarks()}
						/>
					</div>
				)}

				<div className="flex h-[60%] flex-col">
					{/* BOULDER INFOS */}
					<div
						className={`grid grid-cols-8 items-center p-5 ${
							props.full ? "" : " mt-3"
						}`}
					>
						<div className="col-span-6">
							<div className="ktext-section-title">{boulder.name}</div>
							{boulder.isHighball && props.full && (
								<div className="ktext-base-little">High Ball</div>
							)}
							{boulder.dangerousDescent && props.full && (
								<div className="ktext-base-little">Descente dangereuse !</div>
							)}
							{!props.full && (
								<div className="mt-2 flex items-center">
									<GradeScale boulder={boulder} circleSize="little" />
								</div>
							)}
						</div>

						<div className="col-span-2 flex flex-col items-center justify-end gap-2">
							{props.full && (
								<ImageInput
									button="builder"
									onChange={(imgs) => {
										selectedBoulder.value.set((b) => ({
											...b,
											images: [...boulder.images].concat(imgs),
										}));
										select.image(imgs[0]);
									}}
								/>
							)}

							{!props.full && (
								<div className="relative h-[60px] w-full overflow-hidden rounded-sm">
									<Image
										image={boulder.images[0]}
										objectFit="contain"
										alt="Boulder"
										sizeHint="100vw"
									/>
								</div>
							)}
						</div>
					</div>

					{/* TODO : show once good pattern */}
					{/* TABS */}
					{props.full && (
						<div className="ktext-label my-2 flex flex-row px-5 font-bold">
							<span
								className={`w-1/4 ${
									trackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setTrackTab(true)}
							>
								Voies
							</span>
							<span
								className={`w-3/4 ${
									!trackTab ? "text-main" : "text-grey-medium"
								}`}
								onClick={() => setTrackTab(false)}
							>
								Infos du bloc
							</span>
						</div>
					)}

					{/* TRACKSLIST */}
					{trackTab && props.full && (
						<div className="overflow-auto pb-[30px]">
							<TracksListBuilder
								onDrawButtonClick={() => setDisplayDrawer(true)}
								onCreateTrack={() => setDisplayDrawer(true)}
							/>
						</div>
					)}

					{/* BOULDER FORM */}
					{!trackTab && props.full && (
						<div className="overflow-auto border-t border-grey-light px-6 py-10">
							<BoulderForm topo={props.topo} />
							<Button
								content="Supprimer le bloc"
								className="mt-10"
								fullWidth
								onClick={showModalDelete}
							/>
						</div>
					)}
				</div>

				{displayDrawer &&
					<Drawer 
						 onValidate={() => setDisplayDrawer(false)}
					/>
				}

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={useCallback(() => {
						const flushAction = breakpoint === 'mobile' ? flush.all : flush.item;
						deleteBoulder(props.topo, selectedBoulder.value, flushAction, selectedBoulder);
					}, [breakpoint, flush.all, flush.item, props.topo, selectedBoulder, selectedBoulder.value])}
				>
					Etes-vous sûr de vouloir supprimer le bloc ainsi que toutes les voies associées ?
				</ModalDelete>
			</>
		);
	});

	BoulderBuilderContentMobile.displayName = "BoulderBuilderContentMobile";
