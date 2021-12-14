export const googleGetPlace = async (placeId: string) =>
  new Promise((resolve, reject) => {
    if (!placeId) {
      return reject("Need valid place id input")
    }

    // for use in things like GatsbyJS where the html is generated first
    if (typeof window === "undefined") {
      return reject("Need valid window object")
    }

    try {
      const elt = document.createElement("div");
      new window.google.maps.places.PlacesService(elt).getDetails(
        {
            placeId: placeId,
            fields: ['geometry'],
        },
        resolve
      )
      elt.remove();
    } catch (e) {
      reject(e)
    }
});