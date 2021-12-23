import { Bitflag, ClimbTechniques, RockTypes } from "types";

export const hasFlag = <T extends Bitflag>(value: T, flag: T): boolean => (value & flag) === flag;

export function listFlags<T extends Bitflag>(value: T, names: [T, string][]): string[] {
    const flagList = [];
    for (const [flag, name] of names) {
        if (hasFlag(value, flag)) {
            flagList.push(name);
        }
    }
    return flagList;
}

const rockNames: [RockTypes, string][] = [
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

export function listRockTypes(value: RockTypes): string[] {
    return listFlags(value, rockNames);
}


