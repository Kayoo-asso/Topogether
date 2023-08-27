import { useState } from "react";
import { Rock, Sector, Track } from "~/types";
import { classNames, encodeUUID, decodeUUID, gradeCategory } from "~/utils";
import { useMap } from "~/components/openlayers";
import { useQueryParam, useUUIDQueryParam } from "~/helpers/queryParams";

import ArrowSimple from "assets/icons/arrow-simple.svg";
import CrossDelete from "assets/icons/clear.svg";
import { useTopoDoc } from "../providers/TopoDocProvider";
import { trackTextColors } from "~/helpers/colors";

interface SectorListProps {
	sectors: Sector[];
	rocks: Rock[];
}

export function SectorList({ sectors, rocks }: SectorListProps) {
	console.log({ rocks });
	return (
		<div className="flex h-full w-full flex-col px-4">
			{sectors.map((s, idx) => (
				<Section
					key={s.id}
					label={"Secteur " + idx}
					sector={s}
					rocks={rocks.filter((r) => r.sectorId === s.id)}
				/>
			))}
			<div className="mt-6">
				<div className="ktext-label mb-2 text-grey-medium">Sans secteur</div>
				<ul className="ml-3 flex flex-col gap-1">
					{rocks
						.filter((r) => !r.sectorId)
						.map((r, idx) => (
							<RockItem idx={idx} rock={r} />
						))}
				</ul>
			</div>
		</div>
	);
}

interface SectionProps {
	label: string;
	sector: Sector;
	rocks: Rock[];
}

function Section({ sector, rocks, label }: SectionProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="mb-10 flex flex-col">
			<div className="ktext-label text-grey-medium">{label}</div>

			<button
				onClick={() => setExpanded((flag) => !flag)}
				className="ktext-section-title mb-2 flex items-center text-main"
			>
				<ArrowSimple
					className={classNames(
						"h-3 w-3 stroke-main stroke-2 transition-transform md:cursor-pointer",
						expanded ? "-rotate-90" : "-rotate-180"
					)}
					onClick={() => setExpanded((flag) => !flag)}
				/>
				<h2 className="ml-3">{sector.name}</h2>
			</button>

			{expanded && (
				<ul className="ml-3 flex flex-col gap-1">
					{rocks.length === 0 && <li>Aucun rocher référencé</li>}
					{rocks.length > 0 &&
						rocks.map((r, idx) => <RockItem idx={idx} rock={r} />)}
				</ul>
			)}
		</div>
	);
}

interface RockItemProps {
	idx: number;
	rock: Rock;
}

function RockItem({ idx, rock }: RockItemProps) {
	const [selected, setSelected] = useUUIDQueryParam("selected");
	const isSelected = selected === rock.id;

	const [expanded, setExpanded] = useState(false);
	const map = useMap();

	const select = () => {
		setExpanded(true);
		setSelected(rock.id);
		map.getView().setCenter(rock.location);
	};

	return (
		<li>
			<div className="flex flex-row items-center text-dark">
				<button
					className="h-3 w-3"
					onClick={() => setExpanded((flag) => !flag)}
				>
					<ArrowSimple
						className={classNames(
							"stroke-dark transition-transform",
							isSelected && "stroke-2",
							expanded ? "-rotate-90" : "-rotate-180"
						)}
					/>
				</button>
				<button
					className={classNames(
						"ml-3 flex-1 text-left",
						isSelected && "font-semibold"
					)}
					onClick={select}
				>
					<span>{idx}</span>
					<h3 className="ktext-base ml-2 inline-block text-base">
						{rock.name}
					</h3>
				</button>
				{/* No delete button in TopoViewer */}
			</div>
			{expanded && <TrackList rock={rock} />}
		</li>
	);
}

function TrackList({ rock }: { rock: Rock }) {
	const doc = useTopoDoc();
	const tracks = doc.tracks.filter((t) => t.rockId === rock.id);

	const [, setSelectedRock] = useUUIDQueryParam("selected");
	const [, setSelectedTrack] = useUUIDQueryParam("track");

	const select = (track: Track) => {
		setSelectedRock(rock.id);
		setSelectedTrack(track.id);
	}

	return (
		<div className="ml-4">
			{tracks.map((track) => (
				<div className="flex flex-row items-center">
					<div
						className={classNames(
							"ktext-subtitle h-[20px] w-[20px] text-right",
							trackTextColors[gradeCategory(track.grade)]
						)}
					>
						{track.grade}
					</div>
					<button
						key={track.id}
						className={classNames(
							"text-grey-medium ml-2",
							track.name && track.name.length > 16
								? "ktext-base-little"
								: "ktext-base"
						)}
						onClick={() => select(track)}
					>
						{track.name || "Sans nom"}
					</button>
				</div>
			))}
			{/* No track creation button in viewer */}
		</div>
	);
}
