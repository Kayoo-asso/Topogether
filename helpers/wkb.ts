export type ParsedPoint = { type: "Point"; coordinates: [number, number] };
export type ParsedLineString = { type: "LineString"; coordinates: Array<[number, number]> };
export type ParsedPolygon = { type: "Polygon"; coordinates: Array<Array<[number, number]>> };

export type ParsedGeometry = ParsedPoint | ParsedLineString | ParsedPolygon;

export function parseWKB(wkb: string): ParsedGeometry {
    const buffer = hexStringToBuffer(wkb)
	const view = new DataView(buffer);
	const littleEndian = view.getUint8(0) === 1;
	const geometryType = view.getUint32(1, littleEndian);

	switch (geometryType) {
		case 1: // Point
			return { type: "Point", coordinates: parsePoint(view, 5, littleEndian) };
		case 2: // LineString
			return {
				type: "LineString",
				coordinates: parseLineString(view, 5, littleEndian),
			};
		case 3: // Polygon
			return {
				type: "Polygon",
				coordinates: parsePolygon(view, 5, littleEndian),
			};
		default:
			throw new Error("Unsupported geometry type or coordinate dimension");
	}
}

function parsePoint(
	view: DataView,
	offset: number,
	littleEndian: boolean
): [number, number] {
	return [
		view.getFloat64(offset, littleEndian),
		view.getFloat64(offset + 8, littleEndian),
	];
}

function parseLineString(
	view: DataView,
	offset: number,
	littleEndian: boolean
): Array<[number, number]> {
	const numPoints = view.getUint32(offset, littleEndian);
	const points = [];
	let pointOffset = offset + 4;

	for (let i = 0; i < numPoints; i++) {
		points.push(parsePoint(view, pointOffset, littleEndian));
		pointOffset += 16;
	}

	return points;
}

function parsePolygon(
	view: DataView,
	offset: number,
	littleEndian: boolean
): Array<Array<[number, number]>> {
	const numRings = view.getUint32(offset, littleEndian);
	const rings = [];
	let ringOffset = offset + 4;

	for (let i = 0; i < numRings; i++) {
		const [ring, bytesRead] = parseLinearRing(view, ringOffset, littleEndian);
		rings.push(ring);
		ringOffset += bytesRead;
	}

	return rings;
}

function parseLinearRing(
	view: DataView,
	offset: number,
	littleEndian: boolean
): [Array<[number, number]>, number] {
	const numPoints = view.getUint32(offset, littleEndian);
	const points = [];
	let pointOffset = offset + 4;

	for (let i = 0; i < numPoints; i++) {
		points.push(parsePoint(view, pointOffset, littleEndian));
		pointOffset += 16;
	}

	return [points, pointOffset - offset];
}

function hexStringToBuffer(hex: string): ArrayBuffer {
	if (hex.length % 2 !== 0) {
		throw new Error("Invalid hexadecimal string length");
	}

	const buffer = new ArrayBuffer(hex.length / 2);
	const view = new Uint8Array(buffer);

	for (let i = 0; i < hex.length; i += 2) {
		const byteValue = parseInt(hex.substr(i, 2), 16);
		if (isNaN(byteValue)) {
			throw new Error("Invalid hexadecimal string");
		}
		view[i / 2] = byteValue;
	}

	return buffer;
}