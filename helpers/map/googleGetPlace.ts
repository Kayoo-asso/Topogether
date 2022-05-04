export const googleGetPlace = async (placeId: string) =>
  new Promise<google.maps.places.PlaceResult | null>((resolve, reject) => {
    if (!placeId) {
      return reject("Need valid place id input")
    }

    // for use in things like GatsbyJS where the html is generated first
    if (typeof window === "undefined") {
      return reject("Need valid window object")
    }

    const placeDetailsRequest: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['geometry'],
    }

    try {
      const elt = document.createElement("div");
      new google.maps.places.PlacesService(elt).getDetails(placeDetailsRequest, resolve);
      elt.remove();
    } catch (e) {
      reject(e)
    }
});