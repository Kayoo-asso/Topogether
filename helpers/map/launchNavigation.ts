import { Device } from "helpers/context";
import { GeoCoordinates } from "types";
import { toLatLng } from ".";

const launchNavigation = (destination: GeoCoordinates, origin: GeoCoordinates | null, provider: 'apple' | 'google', device: Device) => {
  const d = toLatLng(destination);

  // We have the user position so we can propose the itinerary
  if (origin) {
    const o = toLatLng(origin);
    if (provider === 'apple') { // OPEN ON PLAN
      device === 'desktop' ?
        window.open('https://maps.apple.com/?saddr=' + o.lat + ',' + o.lng+ '&daddr=' + d.lat + ',' + d.lng + '&dirflg=d') :
        // TODO : fix Apple plan opening
        window.open('maps://?saddr=' + o.lat + ',' + o.lng + '&daddr=' + d.lat + ',' + d.lng + '&dirflg=d');
    }
    else { // OPEN ON GOOGLE MAP
      device === 'desktop' ?
        window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + d.lat + "," + d.lng) :
        window.open("https://maps.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + d.lat + "," + d.lng);
    }
  }

  else {
    if (provider === 'apple') { // OPEN ON PLAN
      device === 'desktop' ?
        window.open('https://maps.apple.com/?daddr=' + d.lat + ',' + d.lng + '&dirflg=d') :
        // TODO : fix Apple plan opening
        window.open('maps://?daddr=' + d.lat + ',' + d.lng + '&dirflg=d');
    }
    else { // OPEN ON GOOGLE MAP
      device === 'desktop' ?
        window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + d.lat + "," + d.lng) :
        window.open("https://maps.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + d.lat + "," + d.lng);
    }
  }
}

export default launchNavigation;