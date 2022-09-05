import { ClimbTechniques, RockTypes } from "./Bitflags";

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


// export const TrackStyleName: { [key in TrackStyle]: string } = {
// 	[TrackStyle.CRACK]: 'Fissure',
// 	[TrackStyle.DIHEDRAL]: 'Dièdre',
// 	[TrackStyle.LAYBACK]: 'Dulfer',
// 	[TrackStyle.OVERHANG]: 'Dévers',
// 	[TrackStyle.ROOF]: 'Toit',
// 	[TrackStyle.SLAB]: 'Dalle',
// 	[TrackStyle.TRAVERSE]: 'Traversée',
// }

// export const HoldTypeName: { [key in HoldType]: string } = {
// 	[HoldType.ADHERENCE]: 'Adhérence',
// 	[HoldType.CRIMP]: 'Réglettes',
// 	[HoldType.ONEFINGER]: 'Monodoigts',
// 	[HoldType.PINCH]: 'Pinces',
// 	[HoldType.SLOPPER]: 'A-plats',
// 	[HoldType.TWOFINGERS]: 'Bidoigts',
// }

// export const BodyPositionName: { [key in BodyPosition]: string } = {
// 	[BodyPosition.DROPKNEE]: 'Lolotte',
// 	[BodyPosition.DYNAMIC]: "Dynamique",
// 	[BodyPosition.FLAG]: 'Drapeau',
// 	[BodyPosition.HEELHOOK]: 'Talon',
// 	[BodyPosition.KNEEBAR]: 'Coincement de genou',
// 	[BodyPosition.TOEHOOK]: 'Contrepointe',
// }

// export const DangersName: { [key in Dangers]: string } = {
// 	[Dangers.BadReception]: 'Mauvaise réception',
// 	[Dangers.DangerousDescent]: 'Descente dangereuse',
// 	[Dangers.Exposed]: 'Voie exposée',
// }
