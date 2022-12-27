import { MapToolEnum } from "types";

export const getMapCursorClass = (tool: MapToolEnum) => {
    switch (tool) {
        case "ROCK":
            return "cursor-[url(/assets/icons/colored/_rock.svg),_pointer]";
        case "SECTOR":
            return "cursor-[url(/assets/icons/colored/line-point/_line-point-grey),_pointer]";
        case "PARKING":
            return "cursor-[url(/assets/icons/colored/_parking.svg),_pointer]";
        case "WAYPOINT":
            return "cursor-[url(/assets/icons/colored/_help-round.svg),_pointer]";
        default:
            return "";
    }
};