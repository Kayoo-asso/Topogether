import { TopoType } from "types";

export const TopoTypeToColor = (type: TopoType | undefined) => {
    switch (type) {
        case TopoType.Boulder: return 'fill-main';
        case TopoType.Cliff: return 'fill-third';
        case TopoType.DeepWater: return 'fill-grade-5';
        case TopoType.Multipitch: return 'fill-third-light';
        case TopoType.Artificial: return 'fill-dark';
        default: return 'fill-grey-light';
    }
}