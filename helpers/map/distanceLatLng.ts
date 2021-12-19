
//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export const distanceLatLng = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(radLat1) * Math.cos(radLat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d*1000; // in meter
}

// Converts numeric degrees to radians
const toRad = (val: number) => {
    return val * Math.PI / 180;
}