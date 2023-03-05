import { Selectors, SelectedBoulder, SelectedItem } from "components/store/selectStore";
import { GeoCoordinates, Img, MapToolEnum, Topo, User } from "types";
import { createBoulder, createParking, createTrack, createWaypoint } from "./builder";
import { Quark } from "./quarky";

export const handleNewPhoto = (topo: Quark<Topo>, img: Img, coords: GeoCoordinates, session: User, select: Selectors, selectedItem?: SelectedItem, currentTool?: MapToolEnum) => {
        if (!coords) {
            console.log("no coords");
            return;
        }
        if (img) {
            if (currentTool === "PARKING") {
                select.parking(createParking(topo(), coords, img))
            } else if (currentTool === "WAYPOINT") {
                select.waypoint(createWaypoint(topo(), coords, img))
            } else {
                if (selectedItem?.type === 'boulder') { 
                    selectedItem.value.set((b) => ({
                        ...b,
                        images: [...b.images, img],
                    }));
                    select.image(img);
                    select.track(createTrack(selectedItem.value(), session.id), selectedItem.value);
                } else {
                    const newBoulderQuark = createBoulder(
                        topo,
                        coords,
                        img
                    );
                    select.track(createTrack(newBoulderQuark(), session.id), newBoulderQuark);
                }
            }
        }
    }