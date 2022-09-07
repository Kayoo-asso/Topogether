import { BodyPosition, HoldType, RockTypes, TopoTypes, TrackDanger, TrackStyle } from "./Bitflags";

export const RockNames: [RockTypes, string][] = [
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

export const TopoTypesName: [TopoTypes, string][] = [
	[TopoTypes.Artificial, "Artificiel"],
	[TopoTypes.Boulder, "Bloc"],
	// [TopoTypes.Cliff, "Couenne"],
	[TopoTypes.DeepWater, "Deepwater"],
	// [TopoTypes.Multipitch, "Grande voie"],
]

export const TrackDangerName: [TrackDanger, string][] = [
	[TrackDanger.BadReception, 'Mauvaise réception'],
	[TrackDanger.High, 'Voie haute'],
	[TrackDanger.LooseRock, 'Roche friable'],
]

export const TrackStyleName: [TrackStyle, string][] = [
	[TrackStyle.Crack, 'Fissure'],
	[TrackStyle.Dihedral, 'Dièdre'],
	[TrackStyle.Layback, 'Dulfer'],
	[TrackStyle.Overhang, 'Dévers'],
	[TrackStyle.Roof, 'Toit'],
	[TrackStyle.Slab, 'Dalle'],
	[TrackStyle.Traverse, 'Traversée'],
]

export const HoldTypeName: [HoldType, string][] = [
	[HoldType.Adherence, 'Adhérence'],
	[HoldType.Crimp, 'Réglettes'],
	[HoldType.OneFinger, 'Monodoigts'],
	[HoldType.Pinch, 'Pinces'],
	[HoldType.Slopper, 'A-plats'],
	[HoldType.TwoFingers, 'Bidoigts'],
]

export const BodyPositionName: [BodyPosition, string][] = [
	[BodyPosition.DropKnee, 'Lolotte'],
	[BodyPosition.Dynamic, 'Dynamique'],
	[BodyPosition.HeelHook, 'Talon'],
	[BodyPosition.Kneebar, 'Coincement de genou'],
	[BodyPosition.ToeHook, 'Contrepointe'],
]

export const TrackSpecName: [TrackDanger | TrackStyle | HoldType | BodyPosition, string][] = [
	...TrackDangerName,
	...TrackStyleName,
	...HoldTypeName,
	...BodyPositionName,
]
