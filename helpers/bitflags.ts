import { Bitflag, ClimbTechniques, RockTypes } from "types";

export const hasFlag = <T extends Bitflag>(
	value: T | undefined,
	flag: T
): boolean => (value! & flag) === flag;

export const hasSomeFlags = <T extends Bitflag>(
	value: T | undefined,
	flags: T
): boolean => (value! & flags) !== 0;

export const toggleFlag = <T extends Bitflag>(
	value: T | undefined,
	flag: T
): T => (value! ^ flag) as T;

export const setFlag = <T extends Bitflag>(value: T | undefined, flag: T): T =>
	(value! | flag) as T;

export const unsetFlag = <T extends Bitflag>(
	value: T | undefined,
	flag: T
): T => (value! & ~flag) as T;

export const mergeFlags = <T extends Bitflag>(flags: T[]): T =>
	flags.reduce((m, flag) => (m | flag) as T, 0 as T);

export function listFlags<T extends Bitflag>(
	value: T,
	names: [T, string][]
): string[] {
	const flagList = [];
	for (const [flag, name] of names) {
		if (hasFlag(value, flag)) {
			flagList.push(name);
		}
	}
	return flagList;
}

export const rockNames: [RockTypes, string][] = [
	[RockTypes.Andesite, "Andésite"],
	[RockTypes.Basalt, "Basalte"],
	[RockTypes.Composite, "Composite"],
	[RockTypes.Conglomerate, "Conglomérat"],
	[RockTypes.Chalk, "Craie"],
	[RockTypes.Dolerite, "Dolérite"],
	[RockTypes.Gabbro, "Gabbro"],
	[RockTypes.Gneiss, "Gneiss"],
	[RockTypes.Granite, "Granite"],
	[RockTypes.Gritstone, "Meulière"],
	[RockTypes.Limestone, "Calcaire"],
	[RockTypes.Migmatite, "Migmatite"],
	[RockTypes.Molasse, "Molasse"],
	[RockTypes.Porphyry, "Porphyre"],
	[RockTypes.Quartz, "Quartz"],
	[RockTypes.Quartzite, "Quartzite"],
	[RockTypes.Rhyolite, "Rhyolite"],
	[RockTypes.Sandstone, "Grès"],
	[RockTypes.Schist, "Schiste"],
	[RockTypes.Serpentinite, "Serpentinite"],
	[RockTypes.Trachyandesite, "Trachy-andésite"],
	[RockTypes.Trachyte, "Trachyte"],
	[RockTypes.Tuff, "Tuff"],
	[RockTypes.Volcanic, "Volcanique"],
];

export const ClimbTechniquesName: [ClimbTechniques, string][] = [
	[ClimbTechniques.Aplat, "Aplat"],
	[ClimbTechniques.Adherence, "Adhérence"],
	[ClimbTechniques.Bidoigt, "Bidoigt"],
	[ClimbTechniques.Contrepointe, "Contrepointe"],
	[ClimbTechniques.Dalle, "Dalle"],
	[ClimbTechniques.Devers, "Dévers"],
	[ClimbTechniques.Diedre, "Dièdre"],
	[ClimbTechniques.Drapeau, "Drapeau"],
	[ClimbTechniques.Dulfer, "Dulfer"],
	[ClimbTechniques.Dynamique, "Dynamique"],
	[ClimbTechniques.Epaule, "Epaule"],
	[ClimbTechniques.Fissure, "Fissure"],
	[ClimbTechniques.Genou, "Genou"],
	[ClimbTechniques.Inverse, "Inverse"],
	[ClimbTechniques.Lolotte, "Lolotte"],
	[ClimbTechniques.PetitsPieds, "Petits pieds"],
	[ClimbTechniques.Pince, "Pince"],
	[ClimbTechniques.Reglette, "Réglette"],
	[ClimbTechniques.Retablissement, "Rétablissement"],
	[ClimbTechniques.Talon, "Talon"],
	[ClimbTechniques.Toit, "Toit"],
];

export function listRockTypes(value: RockTypes): string[] {
	return listFlags(value, rockNames);
}
