import { GeoCoordinates, Topo, UUID } from "types";

// TODO:
// - Add error handling for network failures
// - Add progress bar

type Bounds = [number, number, number, number];

class Semaphore {
    private counter: number = 0;
    private max: number;
    private waiting: (() => void)[] = [];
    released: number = 0;

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
        this.released += 1;
        const next = this.waiting.shift();
        if (next) next();
    }

    clear() {
        // TODO: trigger errors in waiting promises
        this.released = 0;
    }
}

const TILE_SIZE = 256;
const LOCK = new Semaphore(200); 

function tileUrl(x: number, y: number, z: number): string {
    // fun fact: the API key is not required to actually get back an image
    return `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${z}!2i${x}!3i${y}!4i256!2m3!1e0!2sm!3i606336644!3m17!2sen-GB!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy50OjZ8cy5lOmd8cC5jOiNmZmU5ZTllOXxwLmw6MTcscy50OjV8cy5lOmd8cC5jOiNmZmY1ZjVmNXxwLmw6MjAscy50OjQ5fHMuZTpnLmZ8cC5jOiNmZmZmZmZmZnxwLmw6MTcscy50OjQ5fHMuZTpnLnN8cC5jOiNmZmZmZmZmZnxwLmw6Mjl8cC53OjAuMixzLnQ6NTB8cy5lOmd8cC5jOiNmZmZmZmZmZnxwLmw6MTgscy50OjUxfHMuZTpnfHAuYzojZmZmZmZmZmZ8cC5sOjE2LHMudDoyfHMuZTpnfHAuYzojZmZmNWY1ZjV8cC5sOjIxLHMudDo0MHxzLmU6Z3xwLmM6I2ZmZGVkZWRlfHAubDoyMSxzLmU6bC50LnN8cC52Om9ufHAuYzojZmZmZmZmZmZ8cC5sOjE2LHMuZTpsLnQuZnxwLnM6MzZ8cC5jOiNmZjMzMzMzM3xwLmw6NDAscy5lOmwuaXxwLnY6b2ZmLHMudDo0fHMuZTpnfHAuYzojZmZmMmYyZjJ8cC5sOjE5LHMudDoxfHMuZTpnLmZ8cC5jOiNmZmZlZmVmZXxwLmw6MjAscy50OjF8cy5lOmcuc3xwLmM6I2ZmZmVmZWZlfHAubDoxN3xwLnc6MS4y!4e0!5m1!5f2!23i1379903`
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

// JavaScript represents small integers with 31 bits
// This is the maximum positive value and the maximum negative value
// that fit in 31 bits (don't forget the sign bit)
const MAX = Math.pow(2, 30) - 1;
const MIN = -MAX;

// Note: maybe max zoom of 21 is fine, which significantly reduces the nb of downloaded tiles
const MAX_ZOOM = 21;

export async function downloadTopoMap(topo: Topo) {
    const start = Date.now();

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
    
    const cache = await caches.open('tile-download');
    const promises: Promise<void>[] = [];
    
    let total = 0;
    for (let z = 0; z <= MAX_ZOOM; z++) {
        // The y-axis is flipped, the origin for (x,y) tiles coordinates is top-left
        let [xmin, ymax] = findTileXY(bounds[0], bounds[1], z);
        let [xmax, ymin] = findTileXY(bounds[2], bounds[3], z);
        console.log(`Corner tiles zoom ${z}: [${xmin}, ${ymax}], [${xmax}, ${ymin}]`)
        
        let i = 0;
        for (let x = xmin; x <= xmax; x++) {
            for (let y = ymin; y <= ymax; y++) {
                promises.push(downloadTile(x, y, z, cache));
                total += 1;
                i++;
            }
        }
    }
    await Promise.all(promises);
    const end = Date.now();
    console.log(`--- Finished downloading ${LOCK.released} tiles (/${total}) in ${end - start}ms for topo ${topo.name} ---`);
    LOCK.clear();
}

async function downloadTile(x: number, y: number, z: number, cache: Cache) {
    const url = tileUrl(x, y, z);
    const exists = await cache.match(url);
    if (exists) return;
    await LOCK.acquire();
    await cache.add(url);
    LOCK.release();
}

const extendBounds = (location: GeoCoordinates, bounds: Bounds) => {
    bounds[0] = Math.min(bounds[0], location[0]),
    bounds[1] = Math.min(bounds[1], location[1]),
    bounds[2] = Math.max(bounds[2], location[0]),
    bounds[3] = Math.max(bounds[3], location[1])
}
