import { isDesktop } from "react-device-detect";
import { GeoCoordinates } from "types";
import { toLatLng } from ".";

const launchNavigation = (location: GeoCoordinates, provider: 'apple' | 'google') => {
  const { lat, lng } = toLatLng(location);
  if (provider === 'apple') {
    navigator.geolocation.getCurrentPosition((pos) => {
      isDesktop ?
        window.open('http://maps.apple.com/?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d') :
        window.open('maps://?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d');
    });
  }
  else {
    isDesktop ?
      window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng) :
      window.open("maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng);
  }
}

export default launchNavigation;