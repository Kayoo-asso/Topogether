import { Bitflag } from "types";

export const hasFlag = <T extends Bitflag>(
	value: T | undefined,
	flag: T
): boolean => (value! & flag) === flag;

export const hasSomeFlags = <T extends Bitflag>(
	value: T | undefined,
	flags: T
): boolean => (value! & flags) !== 0;

export const toggleFlag = <T extends Bitflag>(
	value: T | undefined,
	flag: T
): T => (value! ^ flag) as T;

export const setFlag = <T extends Bitflag>(value: T | undefined, flag: T): T =>
	(value! | flag) as T;

export const unsetFlag = <T extends Bitflag>(
	value: T | undefined,
	flag: T
): T => (value! & ~flag) as T;

export const mergeFlags = <T extends Bitflag>(flags: T[]): T =>
	flags.reduce((m, flag) => (m | flag) as T, 0 as T);

export function listFlags<T extends Bitflag>(
	value: T,
	names: [T, string][]
): string[] {
	const flagList = [];
	for (const [flag, name] of names) {
		if (hasFlag(value, flag)) {
			flagList.push(name);
		}
	}
	return flagList;
}