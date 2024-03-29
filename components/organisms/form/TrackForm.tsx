import React from "react";
import { watchDependencies } from "helpers/quarky";
import { Description, Grade, Name, TopoTypes, TrackSpec, gradeToLightGrade } from "types";
import { toggleFlag } from "helpers/bitflags";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { SpecSelector } from "components/molecules/form/SpecSelector";
import { TextInput } from "components/molecules/form/TextInput";
import { Checkbox } from "components/atoms/Checkbox";
import { TextArea } from "components/molecules/form/TextArea";
import { Button } from "components/atoms/buttons/Button";
import { useDeleteStore } from "components/store/deleteStore";
import { ItemsHeaderButtons } from "../ItemsHeaderButtons";
import { useDrawerStore } from "components/store/drawerStore";
import { GradeSelector } from "components/molecules/drawer/GradeSelector";
import { useTopoType } from "helpers/hooks/TopoTypeProvider";
import { TrackSlider } from "components/molecules/TrackSlider";

const getBGGradeColorClass = (g: Grade | undefined) => {
    if (!g) return "bg-grey-light";
    const lightGrade = gradeToLightGrade(g);
    switch (lightGrade) {
        case 3: return "bg-grade-3"; break;
        case 4: return "bg-grade-4"; break;
        case 5: return "bg-grade-5"; break;
        case 6: return "bg-grade-6"; break;
        case 7: return "bg-grade-7"; break;
        case 8: return "bg-grade-8"; break;
        case 9: return "bg-grade-9"; break;
        case 'P': return "bg-grey-light"; break;
    }
};

interface TrackFormProps {
	className?: string,
}

export const TrackForm: React.FC<TrackFormProps> = watchDependencies(
	(props: TrackFormProps) => {
		const topoType = useTopoType();
		const selectedBoulder = useSelectStore(s => s.item as SelectedBoulder);
		if (!selectedBoulder.selectedTrack) throw new Error("Trying to open TrackForm without any track");
		const select = useSelectStore(s => s.select);
		const flush = useSelectStore(s => s.flush);
		const del = useDeleteStore(d => d.delete);
		const openGradeSelector = useDrawerStore(d => d.openGradeSelector);
		const closeDrawer = useDrawerStore(d => d.closeDrawer);

		const trackQuark = selectedBoulder.selectedTrack;
		const track = trackQuark();

		return (
			<div className="w-full h-full flex flex-col gap-6">
				<ItemsHeaderButtons item={track} builder onClose={() => { flush.track(); select.image(selectedBoulder.value().images[0]); closeDrawer(); }} />
				<div className="ktext-base-superbig px-6 mt-3 hidden md:block">Voie {track.index+1}</div>

				<div className="px-6 hidden md:block">
					<TrackSlider />
				</div>

				<div
					className={
						"flex h-full flex-col gap-4 px-6 " +
						(props.className ? props.className : "")
					}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-row gap-1">
						<TextInput
							id="track-name"
							label="Nom de la voie"
							value={track.name}
							onChange={(e) =>
								trackQuark.set({
									...track,
									name: e.target.value as Name,
								})
							}
						/>
						<div 
							id="track-grade"
							className={`
								w-1/4 flex items-center justify-center mt-2 rounded-sm text-white border border-grey-light md:cursor-pointer 
								${getBGGradeColorClass(track.grade)}
							`}
							onClick={openGradeSelector}
						>{track.grade || 'Pr'}</div>
					</div>

					<div className="flex flex-col gap-3">
						<Checkbox
							label="Incontournable"
							checked={track.mustSee}
							onClick={(checked) =>
								trackQuark.set({
									...track,
									mustSee: checked,
								})
							}
						/>
						<Checkbox
							label="Traversée"
							className={topoType === TopoTypes.Cliff ? 'hidden' : ''}
							checked={track.isTraverse}
							onClick={(checked) =>
								trackQuark.set({
									...track,
									isTraverse: checked,
								})
							}
						/>
						<Checkbox
							label="Départ assis"
							className={topoType === TopoTypes.Cliff ? 'hidden' : ''}
							checked={track.isSittingStart}
							onClick={(checked) =>
								trackQuark.set({
									...track,
									isSittingStart: checked,
								})
							}
						/>
					</div>

					<TextInput 
						id="anchor-nb"
						className={topoType === TopoTypes.Cliff ? '' : 'hidden'}
						label="Dégaines"
						type="number"
						step={1}
						value={track.anchors}
						onChange={(e) =>
							trackQuark.set({
								...track,
								anchors: parseInt(e.target.value),
							})
						}
					/>

					<SpecSelector
						value={track.spec}
						onChange={(v) => {
							trackQuark.set((t) => ({
								...t,
								spec: toggleFlag(track.spec, v as TrackSpec),
							}));
						}}
					/>

					<TextInput
						id="track-height"
						label="Hauteur"
						type="number"
						step="any"
						value={track.height}
						onChange={(e) =>
							trackQuark.set({
								...track,
								height: parseFloat(e.target.value),
							})
						}
					/>

					<TextArea
						id="track-description"
						label="Description"
						value={track.description}
						onChange={(e) =>
							trackQuark.set({
								...track,
								description: e.target.value as Description,
							})
						}
					/>

					<div className="flex w-full items-end pb-6">
						<Button
							content="Supprimer"
							onClick={() => del.item({ type: 'track', value: trackQuark, boulder: selectedBoulder.value, selectedBoulder: selectedBoulder})}
							fullWidth
						/>
					</div>
				</div>

				<GradeSelector />
			</div>
		);
	}
);

TrackForm.displayName = "TrackForm";
