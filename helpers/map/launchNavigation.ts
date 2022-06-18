import { Device } from "helpers/context";
import { useIsIos } from "helpers/hooks";
import { GeoCoordinates } from "types";
import { toLatLng } from ".";

const launchNavigation = (location: GeoCoordinates, provider: 'apple' | 'google', device: Device) => {
  const { lat, lng } = toLatLng(location);
  const isIos = useIsIos();
  alert("1");
  if (provider === 'apple') {
    navigator.geolocation.getCurrentPosition((pos) => {
      alert("2");
      device === 'desktop' ?
        window.open('https://maps.apple.com/?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d') :
        // TODO : fix Apple plan opening
        window.open('maps://?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d');
    });
  }
  else {
    navigator.geolocation.getCurrentPosition((pos) => {
      device === 'desktop' ?
        window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng) :
        isIos ? window.open("https://maps.google.com/maps/dir/?api=1&origin=" + pos.coords.latitude + "," + pos.coords.longitude + "&destination=" + lat + "," + lng + "&travelmode=driving&layer=traffic") :
          window.open("https://www.google.com/maps/dir/?api=1&origin=" + pos.coords.latitude + "," + pos.coords.longitude + "&destination=" + lat + "," + lng + "&travelmode=driving&layer=traffic");
    });
  }
}

export default launchNavigation;