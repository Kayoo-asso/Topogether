import { Device } from "helpers/context";
import { GeoCoordinates } from "types";
import { toLatLng } from ".";

const launchNavigation = (location: GeoCoordinates, provider: 'apple' | 'google', device: Device) => {
  const { lat, lng } = toLatLng(location);
  if (provider === 'apple') {
    navigator.geolocation.getCurrentPosition((pos) => {
      device === 'desktop' ?
        window.open('https://maps.apple.com/?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d') :
        // TODO : fix Apple plan opening
        window.open('maps://maps.google.com/maps?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d');
    });
  }
  else {
    navigator.geolocation.getCurrentPosition((pos) => {
      device === 'desktop' ?
        window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng) :
        window.open("https://www.google.com/maps/dir/?api=1&origin=" + pos.coords.latitude + "," + pos.coords.longitude + "&destination=" + lat + "," + lng + "&travelmode=driving&layer=traffic");
    });
  }
}

export default launchNavigation;