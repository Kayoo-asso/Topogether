import { Quark } from "helpers/quarky";
import { Topo, Sector, TrackRating, UUID, TopoTypes } from "types";

// --- averageTrackNote ---
export function averageTrackNote(ratings: TrackRating[]): number {
	let total = 0;
	for (let i = 0; i < ratings.length; i++) {
		total += ratings[i].rating;
	}
	return total / ratings.length;
}

// --- TopoTypeToColor ---
export const TopoTypeToColor = (type?: TopoTypes) => {
	// console.log(type);
	switch (type) {
		case TopoTypes.Boulder:
			return "main";
		case TopoTypes.Cliff:
			return "third";
		case TopoTypes.DeepWater:
			return "grade-5";
		case TopoTypes.Artificial:
			return "dark";
		default:
			return "grey-light";
	}
};

// --- computeBuilderProgress ---

const rules = [
	"TOPO_IMAGE",
	"DESCRIPTION",
	"ROCK_TYPE",
	"ALTITUDE",
	"PARKINGS",
	"ACCESS_DURATION",
	"ACCESS_DIFFICULTY",
	"ACCESS_STEP",
	"BOULDERS",
	"TRACKS",
] as const;

export const rulesText = {
	INFOS_TOPO: "Ajouter les infos du topo",
	TOPO_IMAGE: "Ajouter une photo du site",
	DESCRIPTION: "Ajouter la description du site",
	ROCK_TYPE: "Préciser le type de roche",
	ALTITUDE: "Préciser l'altitude du site",
	PARKINGS: "Ajouter au moins un parking",
	INFOS_ACCESS: "Décrire la marche d'approche",
	ACCESS_DURATION: "Préciser le temps de marche",
	ACCESS_DIFFICULTY: "Préciser la difficulté",
	ACCESS_STEP: "Ajouter au moins une étape",
	MANAGRES: "Ajouter les coordonnées des gestionnaires du site",
	BOULDERS: "Ajouter au moins un bloc",
	TRACKS: "Ajouter au moins un passage",
};

export type Rule = typeof rules[number] | "INFOS_TOPO" | "INFOS_ACCESS";

export const computeBuilderProgress = (topo: Quark<Topo>): number => {
	return Math.round(
		(rules.filter((rule) => validateRule(topo(), rule)).length / rules.length) *
			100
	);
};

export const validateRule = (topo: Topo, rule: Rule): boolean => {
	switch (rule) {
		case "INFOS_TOPO":
			return (
				validateRule(topo, "TOPO_IMAGE") &&
				validateRule(topo, "DESCRIPTION") &&
				validateRule(topo, "ROCK_TYPE") &&
				validateRule(topo, "ALTITUDE")
			);
		case "TOPO_IMAGE":
			return !!topo.image;
		case "DESCRIPTION":
			return !!topo.description;
		case "ROCK_TYPE":
			return !!topo.rockTypes;
		case "ALTITUDE":
			return (topo.altitude !== undefined && topo.altitude !== null);
		case "PARKINGS":
			return topo.parkings.length > 0;
		case "INFOS_ACCESS":
			return (
				validateRule(topo, "ACCESS_DURATION") &&
				validateRule(topo, "ACCESS_DIFFICULTY") &&
				validateRule(topo, "ACCESS_STEP")
			);
		case "ACCESS_DURATION":
			return (
				topo.accesses.length > 0 &&
				topo.accesses.toArray().every((access) => access.duration !== undefined)
			);
		case "ACCESS_DIFFICULTY":
			return (
				topo.accesses.length > 0 &&
				topo.accesses
					.toArray()
					.every((access) => access.difficulty !== undefined)
			);
		case "ACCESS_STEP":
			return (
				topo.accesses.length > 0 &&
				topo.accesses
					.toArray()
					.every((access) => access.steps && access.steps.length > 0)
			);
		case "BOULDERS":
			return topo.boulders.length > 0;
		case "TRACKS":
			return (
				topo.boulders
					.toArray()
					.map((boulder) => boulder.tracks.toArray())
					.flat().length > 0
			);
		default:
			return false;
	}
};
