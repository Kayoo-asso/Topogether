import { GeoCoordinates, Topo } from "types";

type Bounds = [number, number, number, number];

class Semaphore {
    private counter: number = 0;
    private max: number;
    private waiting: (() => void)[] = [];

    constructor(max: number) {
        this.max = max;
    }

    async acquire(): Promise<void> {
        if (this.counter < this.max) {
            this.counter += 1;
            return Promise.resolve();
        } else {
            return new Promise<void>(resolve => {
                this.waiting.push(resolve);
            })
        }
    }

    release() {
        this.counter -= 1;
        const next = this.waiting.shift();
        if (next) next();
    }
}

const TILE_SIZE = 256;
const LOCK = new Semaphore(200); 

function tileUrl(x: number, y: number, z: number): string {
    // fun fact: the API key is not required to actually get back an image
    return `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${z}!2i${x}!3i${y}!4i256!2m3!1e0!2sm!3i606220892!3m12!2sen-US!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m1!5f2!23i1379903`
}

// Based on https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
function worldCoords(lng: number, lat: number): [number, number] {
    let siny = Math.sin((lat * Math.PI) / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999); 

    return [
        TILE_SIZE * (0.5 + lng / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
    ];
}

function findTileXY(lng: number, lat: number, zoom: number): [x: number, y: number] {
    const [worldx, worldy] = worldCoords(lng, lat);

    const scale = 1 << zoom;

    const tilex = ((worldx * scale) / TILE_SIZE) | 0;
    const tiley = ((worldy * scale) / TILE_SIZE) | 0;

    return [tilex, tiley];
}

function findMinZoom(bounds: Bounds) {
    const lngSpan = bounds[2] - bounds[0];
    const latSpan = bounds[3] - bounds[1];

    const lngPercent = lngSpan / 360;
    const latPercent = latSpan / 180;

    console.log("Lng percentage:", lngPercent);
    console.log("Lat percentage:", latPercent);

    const maxPercent = Math.max(lngPercent, latPercent);

    // We want the smallest minZoom such that the percentage of the world covered by each tile is superior to maxPercent
    // tilePercent = 1 / 2 ^ minZoom
    // We want:
    // tilePercent > maxPercent
    // <=> 1 / 2 ^ minZoom > maxPercent
    // <=> minZoom < Math.log2(1 / maxPercent)
    const minzoom = Math.log2(1 / maxPercent) | 0;

    return minzoom
}


// JavaScript represents small integers with 31 bits
// This is the maximum positive value
const MAX = Math.pow(2, 30) - 1;
const MIN = -MAX;

const MAX_ZOOM = 22;

export async function downloadTopoMap(topo: Topo) {
    console.log("--- downloadMap ---");
    const start = Date.now();
    const div = document.createElement('div');
    div.style.width = '100vw';
    div.style.height = '100vh';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);

    // xmin, ymin, xmax, ymax
    const bounds: Bounds = [MAX, MAX, MIN, MIN];
    
    for (const boulder of topo.boulders) {
        extendBounds(boulder.location, bounds); 
    }
    for (const parking of topo.parkings) {
        extendBounds(parking.location, bounds);
    }
    for (const waypoint of topo.waypoints) {
        extendBounds(waypoint.location, bounds);
    }
    
    const minZoom = findMinZoom(bounds);
    console.log("Min zoom:", minZoom);

    await caches.delete('tile-download');
    const cache = await caches.open('tile-download');

    const promises: Promise<void>[] = [];
    let total = 0;
    
    for (let z = minZoom; z <= MAX_ZOOM; z++) {
        let [xmin, ymax] = findTileXY(bounds[0], bounds[1], z);
        let [xmax, ymin] = findTileXY(bounds[2], bounds[3], z);
        console.log(`--- Zoom level ${z} ---`)
        console.log(`Bottom left tile: [${xmin}, ${ymin}]`);
        console.log(`Upper left tile: [${xmax}, ${ymax}]`);
        let i = 0;
        for (let x = xmin; x <= xmax; x++) {
            for (let y = ymin; y <= ymax; y++) {
                promises.push(downloadTile(x, y, z, cache));
                i++;
                total++;
            }
        }
        console.log(i + " tiles");
    }
    const end = Date.now();
    console.log(`Finished downloading ${total} tiles in ${end - start}ms`);
}

async function downloadTile(x: number, y: number, z: number, cache: Cache) {
    await LOCK.acquire();
    await cache.add(tileUrl(x, y, z));
}

const extendBounds = (location: GeoCoordinates, bounds: Bounds) => {
    bounds[0] = Math.min(bounds[0], location[0]),
    bounds[1] = Math.min(bounds[1], location[1]),
    bounds[2] = Math.max(bounds[2], location[0]),
    bounds[3] = Math.max(bounds[3], location[1])
}
