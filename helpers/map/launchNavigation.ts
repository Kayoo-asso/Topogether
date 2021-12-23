import { isDesktop } from "react-device-detect";
import { GeoCoordinates } from "types";

const launchNavigation = (location: GeoCoordinates, provider: 'apple' | 'google') => {
    if (provider === 'apple') {
      navigator.geolocation.getCurrentPosition((pos) => {
        isDesktop ?
          window.open('http://maps.apple.com/?saddr='+pos.coords.latitude+','+pos.coords.longitude+'&daddr='+location.lat+','+location.lng+'&dirflg=d') :
          window.open('maps://?saddr='+pos.coords.latitude+','+pos.coords.longitude+'&daddr='+location.lat+','+location.lng+'&dirflg=d');
      });
    }
    else {
      isDesktop ?
        window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination="+location.lat+","+location.lng) :
        window.open("maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination="+location.lat+","+location.lng);       
    }
}

export default launchNavigation;