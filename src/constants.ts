import {
	BodyPosition,
	GeoCoordinates,
	HoldType,
	RockTypes,
	TopoTypes,
	TrackPersonnality,
	TrackStyle,
} from "~/types";

export const fontainebleauLocation: GeoCoordinates = [2.697569, 48.399065];

export const topogetherUrl = "https://builder.topogether.com";
export const staticUrl = {
	logo_color: `/assets/img/Logo_green_topogether.png`,
	logo_black: `/assets/img/Logo_black_topogether.png`,
	logo_white: `/assets/img/Logo_white_topogether.png`,
	illuLogin: `${topogetherUrl}/assets/img/illustrations/login_background topogether climbing boulder.png`,
	illu404: `${topogetherUrl}/assets/img/illustrations/Error 404 Topogether climbing escalade Fontainebleau topo.png`,
	defaultProfilePicture: `/assets/img/Default_profile_picture.png`,
	defaultKayoo: `/assets/img/Kayoo_defaut_image.png`,
	deleteWarning: `/assets/img/Warning delete topogether boulder escalade topo.png`,
};

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
	// [TopoTypes.Artificial, "Artificiel"],
	[TopoTypes.Boulder, "Bloc"],
	[TopoTypes.Cliff, "Voie"],
	[TopoTypes.DeepWater, "Deepwater"],
];

export const TrackPersonnalityName: [TrackPersonnality, string][] = [
	[TrackPersonnality.Power, "Puissance"],
	[TrackPersonnality.Resistance, "Résistance"],
	[TrackPersonnality.Precision, "Précision"],
];

export const TrackStyleName: [TrackStyle, string][] = [
	[TrackStyle.Crack, "Fissure"],
	[TrackStyle.Dihedral, "Dièdre"],
	[TrackStyle.Layback, "Dulfer"],
	[TrackStyle.Overhang, "Dévers"],
	[TrackStyle.Roof, "Toit"],
	[TrackStyle.Slab, "Dalle"],
	[TrackStyle.Traverse, "Traversée"],
];

export const HoldTypeName: [HoldType, string][] = [
	[HoldType.Adherence, "Adhérence"],
	[HoldType.Crimp, "Réglettes"],
	[HoldType.OneFinger, "Monodoigts"],
	[HoldType.Pinch, "Pinces"],
	[HoldType.Slopper, "A-plats"],
	[HoldType.TwoFingers, "Bidoigts"],
];

export const BodyPositionName: [BodyPosition, string][] = [
	[BodyPosition.DropKnee, "Lolotte"],
	[BodyPosition.Dynamic, "Dynamique"],
	[BodyPosition.HeelHook, "Talon"],
	[BodyPosition.Kneebar, "Coincement de genou"],
	[BodyPosition.ToeHook, "Contrepointe"],
];

export const TrackSpecName: [
	TrackPersonnality | TrackStyle | HoldType | BodyPosition,
	string
][] = [
	...TrackPersonnalityName,
	...TrackStyleName,
	...HoldTypeName,
	...BodyPositionName,
];
