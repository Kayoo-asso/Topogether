import { Base64 } from "js-base64";
import type { UUID } from "types";

export function arrayMove<T>(array: T[], from: number, to: number) {
    if( to === from ) return array;
    
    var target = array[from];                         
    var increment = to < from ? -1 : 1;
    
    for(var k = from; k != to; k += increment){
        array[k] = array[k + increment];
    }
    array[to] = target;
    return array;
}

export const splitArray = function<T>(arr: T[], predicate: (arg: T) => boolean) {
    const matches = [];
    const notMatches = [];
    for (const elt of arr) {
      if (predicate(elt)) matches.push(elt)
      else notMatches.push(elt);
    }
    return [matches, notMatches];
}

export function setReactRef<T>(
    // React types for refs are a mess, using manual ones is easier
    ref: { current: T } | ((value: T) => void) | null,
    value: T
) {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}


export const distanceBetween = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export const formatDate = (date: String) => { // DB format : YYYY-MM-DD
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  return `${day}-${month}-${year}`;
};

// --- Cloudflare Images ---

export const VariantWidths = [16, 32, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;
export type VariantWidth = typeof VariantWidths[number]

type VW<W extends number> = `${W}vw`;
type PX<W extends number> = `${W}px`;
export type ViewportWidth = VW<number>;
export type PixelWidth = PX<number>;

export type SourceSize = ViewportWidth | PixelWidth;

export const cloudflareUrl = (imageId: UUID, width: VariantWidth): string =>
    `https://imagedelivery.net/9m8hQCHM9NXY8VKZ1mHt-A/${imageId}/${width}w`;


// --- Encode UUID ---

const readHexByte = (uuid: UUID, start: number) => parseInt(uuid.substring(start, start + 2), 16);

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
var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
function byteToHex(b: number) {
    return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
}

function pushBytes(output: string, bytes: Uint8Array, start: number, length: number): string {
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