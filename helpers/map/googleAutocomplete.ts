//See: https://atomizedobjects.com/blog/react/how-to-use-google-autocomplete-with-react-hooks/

export const googleAutocomplete = async (text: string) =>
  new Promise((resolve: (a: google.maps.places.AutocompletePrediction[] | null, b: google.maps.places.PlacesServiceStatus) => void, reject) => {
    if (!text) {
      return reject("Need valid text input")
    }
    // for use in things like GatsbyJS where the html is generated first
    if (typeof window === "undefined") {
      return reject("Need valid window object")
    }

    try {
      new google.maps.places.AutocompleteService().getPlacePredictions(
        { 
          input: text,
          types: ['(regions)'], //https://developers.google.com/maps/documentation/places/web-service/supported_types#table3 
        },
        resolve
      )
    } catch (e) {
      reject(e)
    }
});