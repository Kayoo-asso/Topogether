import { Reception, Difficulty, TopoType, Orientation, TrackStyle, HoldType, BodyPosition, Dangers, Enum, RockType } from "./Enums";


export const DifficultyName: { [key in Difficulty]: string } = {
	[Difficulty.Good]: "Facile",
	[Difficulty.OK]: "Moyen",
	[Difficulty.Bad]: "Difficile",
	[Difficulty.Dangerous]: "Dangereuse",
};

export const ReceptionName: { [key in Reception]: string } = {
	[Reception.Good]: "Bonne : sol plat",
	[Reception.OK]: "Moyenne : sol irrégulier ou en pente",
	[Reception.Dangerous]: "Dangereuse : rocher présent",
	[Reception.None]: "ATTENTION ! Pas d'espace de réception",
};

export const TopoTypeName = {
	[TopoType.Artificial]: "Artificiel",
	[TopoType.Boulder]: "Bloc",
	// [TopoType.Cliff]: "Falaise",
	[TopoType.DeepWater]: "Psicobloc",
	// [TopoType.Multipitch]: "Grande voie",
};

export const OrientationName: { [key in Orientation]: string } = {
	[Orientation.N]: "N",
	[Orientation.NE]: "NE",
	[Orientation.E]: "E",
	[Orientation.SE]: "SE",
	[Orientation.S]: "S",
	[Orientation.SW]: "SW",
	[Orientation.W]: "W",
	[Orientation.NW]: "NW",
};

export function selectOptions<T extends Enum>(
	names: Record<T, string>
): [T, string][] {
	// We're going to handle enum values as raw numbers here, so TypeScript won't be happy.
	// Basically we convert all numeric keys back to number (since Object.entries only gives us strings)
	return Object.entries(names).map(
		([key, value]) => [isNaN(+key) ? key : +key, value] as any
	);
}
