import { Quark } from "helpers/quarky"
import { Boulder, Parking, Sector, Track, Waypoint } from "./Topo"

export type SelectedNone = {
	type: 'none'
}
export type SelectedSector = {
	type: 'sector',
	value: Quark<Sector>
}
export type SelectedBoulder = {
	type: 'boulder',
	value: Quark<Boulder>,
	selectedTrack?: Quark<Track>
}
export type SelectedParking = {
	type: 'parking',
	value: Quark<Parking>
}
export type SelectedWaypoint = {
	type: 'waypoint',
	value: Quark<Waypoint>
}

export type SelectedItem = SelectedNone | SelectedBoulder | SelectedParking | SelectedWaypoint;

export type InteractItem = SelectedNone | SelectedSector | SelectedBoulder | SelectedParking | SelectedWaypoint;

export type DropdownItem = {
	position: { x: number, y: number },
	item: InteractItem
}