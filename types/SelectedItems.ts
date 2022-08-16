import { Quark } from "helpers/quarky"
import { Dispatch, SetStateAction } from "react"
import { Img } from "./Img"
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
	selectedTrack?: Quark<Track>,
	selectedImage?: Img,
}
export const selectBoulder = (b: Quark<Boulder>, setSelectedItem: Dispatch<SetStateAction<SelectedItem>>, t?: Quark<Track>) => {
	setSelectedItem({
		type: 'boulder',
		value: b,
		selectedTrack: t,
		selectedImage: b().images.length > 0 ? b().images[0] : undefined
	})
}
export const selectTrack = (b: Quark<Boulder>, t: Quark<Track>, setSelectedItem: Dispatch<SetStateAction<SelectedItem>>) => {
	setSelectedItem({
		type: 'boulder',
		value: b,
		selectedTrack: t,
		selectedImage: b().images.find((i) => i.id === t().lines.at(0)?.imageId) || (b().images.length > 0 ? b().images[0] : undefined)
	})
}
export const selectImage = (selectedBoulder: SelectedBoulder, i: Img, setSelectedItem: Dispatch<SetStateAction<SelectedItem>>) => {
	setSelectedItem({
		...selectedBoulder,
		selectedImage: i
	})
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