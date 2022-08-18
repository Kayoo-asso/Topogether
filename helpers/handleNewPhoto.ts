import { Dispatch, SetStateAction } from "react";
import { GeoCoordinates, Img, MapToolEnum, Topo, User } from "types";
import { SelectedBoulder, SelectedItem, selectImage, selectTrack } from "types/SelectedItems";
import { createBoulder, createParking, createTrack, createWaypoint } from "./builder";
import { Quark } from "./quarky";

export const handleNewPhoto = (topo: Quark<Topo>, img: Img, coords: GeoCoordinates, selectedItem: SelectedItem, setSelectedItem: Dispatch<SetStateAction<SelectedItem>>, session: User, currentTool?: MapToolEnum) => {
        if (!coords) {
            console.log("no coords");
            return;
        }
        if (img) {
            if (currentTool === "PARKING") {
                setSelectedItem({ type: 'parking', value: createParking(topo(), coords, img) })
            } else if (currentTool === "WAYPOINT") {
                setSelectedItem({ type: 'waypoint', value: createWaypoint(topo(), coords, img) })
            } else {
                if (selectedItem.type === 'boulder') {
                    selectImage(img, setSelectedItem);
                    const sBoulder = selectedItem.value();
                    const newImages = sBoulder.images;
                    newImages.push(img);
                    selectedItem.value.set((b) => ({
                        ...b,
                        images: newImages,
                    }));
                    selectTrack(selectedItem.value, createTrack(sBoulder, session.id), setSelectedItem);
                } else {
                    const newBoulderQuark = createBoulder(
                        topo,
                        coords,
                        img
                    );
                    selectTrack(newBoulderQuark, createTrack(newBoulderQuark(), session.id), setSelectedItem);
                }
            }
        }
    }