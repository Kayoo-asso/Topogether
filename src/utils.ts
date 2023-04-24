import { Base64 } from "js-base64";
import { ForwardedRef } from "react";
import { Grade, UUID } from "~/types";

export function classNames(
	...classes: Array<string | undefined | null | false>
) {
	return classes.filter(Boolean).join(" ");
}


// Just a utility type for nice TypeScript checks for the `gradeCategory` function below
type FirstLetter<T> = T extends `${infer F}${infer _}` ? F : null;

export function gradeCategory<G extends Grade | null>(grade: G): G extends string ? FirstLetter<G> : "P" {
  return grade ? grade[0] : "P" as any;
}

export function buildGradeHistogram(grades: Array<Grade | null>) {
	const histogram = {
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		P: 0,
	};
	for (const grade of grades) {
		// Tracks without a grade go into the `P` (Project) category
		histogram[gradeCategory(grade)] += 1;
	}
	return histogram;
}

export function setReactRef<T>(
	ref: ForwardedRef<T> | null,
	value: T
) {
	if (typeof ref === "function") {
		ref(value);
	} else if (ref) {
		ref.current = value;
	}
}

// --- Encode UUID ---

const readHexByte = (uuid: UUID, start: number) =>
	parseInt(uuid.substring(start, start + 2), 16);

// trusts the input to be a correct UUID
// UUID v4 follows a 8-4-4-4-12 format
export function encodeUUID(uuid: UUID): string {
	const bytes = new Uint8Array(16);
	bytes[0] = readHexByte(uuid, 0);
	bytes[1] = readHexByte(uuid, 2);
	bytes[2] = readHexByte(uuid, 4);
	bytes[3] = readHexByte(uuid, 6);
	// first dash
	bytes[4] = readHexByte(uuid, 9);
	bytes[5] = readHexByte(uuid, 11);
	// second dash
	bytes[6] = readHexByte(uuid, 14);
	bytes[7] = readHexByte(uuid, 16);
	// third dash
	bytes[8] = readHexByte(uuid, 19);
	bytes[9] = readHexByte(uuid, 21);
	// fourth dash
	bytes[10] = readHexByte(uuid, 24);
	bytes[11] = readHexByte(uuid, 26);
	bytes[12] = readHexByte(uuid, 28);
	bytes[13] = readHexByte(uuid, 30);
	bytes[14] = readHexByte(uuid, 32);
	bytes[15] = readHexByte(uuid, 34);

	return Base64.fromUint8Array(bytes, true);
}

// can't use .toString(16), since it does not encode the hexadecimal '0' for numbers < 16
var hexChar = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
];
function byteToHex(b: number) {
	return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
}

function pushBytes(
	output: string,
	bytes: Uint8Array,
	start: number,
	length: number
): string {
	let result = output;
	for (let i = start; i < start + length; ++i) {
		result += byteToHex(bytes[i]);
	}
	return result;
}

// trusts the input to be a correct Base64URL string
export function decodeUUID(short: string): string {
	const bytes = Base64.toUint8Array(short);
	let output = pushBytes("", bytes, 0, 4);
	output += "-";
	output = pushBytes(output, bytes, 4, 2);
	output += "-";
	output = pushBytes(output, bytes, 6, 2);
	output += "-";
	output = pushBytes(output, bytes, 8, 2);
	output += "-";
	output = pushBytes(output, bytes, 10, 6);
	// the 'uuid' l
	return output;
}

// -- Write to clipboard --
interface ClipboardWriteCallbacks {
	onSuccess?: () => void;
	onError?: () => void;
}

export function copyToCliboard(text: string, cb?: ClipboardWriteCallbacks) {
	return navigator.clipboard.writeText(text).then(cb?.onSuccess).catch(cb?.onError);
}