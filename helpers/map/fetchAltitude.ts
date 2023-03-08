export const fetchAltitude = async (lng: number, lat: number) => {
    const url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lng},${lat}.json?layers=contour&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.features[0].properties.ele + 10 as number;
}