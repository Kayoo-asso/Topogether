import { isDesktop } from "react-device-detect";
import { GeoCoordinates } from "types";
import { toLatLng } from ".";

const launchNavigation = (location: GeoCoordinates, provider: 'apple' | 'google') => {
  const { lat, lng } = toLatLng(location);
  if (provider === 'apple') {
    navigator.geolocation.getCurrentPosition((pos) => {
      isDesktop ?
        window.open('https://maps.apple.com/?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d') :
        // TODO : fix Apple plan opening
        window.open('maps://?saddr=' + pos.coords.latitude + ',' + pos.coords.longitude + '&daddr=' + lat + ',' + lng + '&dirflg=d');
    });
  }
  else {
    isDesktop ?
      window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng) :
      window.open("https://maps.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" + lat + "," + lng);
  }
}

export default launchNavigation;