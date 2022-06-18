import { Device } from "helpers/context";
import { GeoCoordinates } from "types";
import { toLatLng } from ".";

const launchNavigation = (location: GeoCoordinates, provider: 'apple' | 'google', device: Device) => {
  const { lat, lng } = toLatLng(location);
  
  // OPEN ON PLAN
  if (provider === 'apple') {
    navigator.geolocation.getCurrentPosition((pos) => {
      device === 'desktop' ?
        window.open('https://maps.apple.com/?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d') :
        // TODO : fix Apple plan opening
        window.open('maps://?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d');
    });
  }

  // OPEN ON GOOGLE MAP
  else {
    device === 'desktop' ?
      window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng) :
      window.open("https://maps.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng);
  }
}

export default launchNavigation;