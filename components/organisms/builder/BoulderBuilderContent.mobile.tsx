import React, { useState } from "react";
import { Topo } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { Image } from "components/atoms/Image";
import { TracksListBuilder } from "./TracksListBuilder";
import { Drawer } from "../Drawer";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { GradeScale } from "components/molecules/GradeScale";
import { ImageSlider } from "components/molecules/ImageSlider";
import { ImageInput } from "components/molecules/form/ImageInput";
import { RockForm } from "../form/RockForm";
import { Button } from "components/atoms/buttons/Button";
import { useDeleteStore } from "components/store/deleteStore";
import { useDrawerStore } from "components/store/drawerStore";

interface BoulderBuilderContentMobileProps {
	full: boolean,
	topo: Quark<Topo>;
}

export const BoulderBuilderContentMobile: React.FC<BoulderBuilderContentMobileProps> =
	watchDependencies((props: BoulderBuilderContentMobileProps) => {
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		const boulder = selectedBoulder.value();
		const select = useSelectStore(s => s.select);
		const del = useDeleteStore(d => d.delete);

		const isDrawerOpen = useDrawerStore(d => d.isDrawerOpen);

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
									<GradeScale boulders={[boulder]} circleSize="little" />
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
							<TracksListBuilder />
						</div>
					)}

					{/* BOULDER FORM */}
					{!trackTab && props.full && (
						<div className="overflow-auto border-t border-grey-light px-6 py-10">
							<RockForm topo={props.topo} />
							<Button
								content="Supprimer le bloc"
								className="mt-10"
								fullWidth
								onClick={() => del.item(selectedBoulder)}
							/>
						</div>
					)}
				</div>

				{isDrawerOpen &&
					<Drawer />
				}
			</>
		);
	});

	BoulderBuilderContentMobile.displayName = "BoulderBuilderContentMobile";
