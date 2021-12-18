export type Coordinates = {
  posX: number | null,
  posY: number | null,
};

export type Area = {
  points: Coordinates[],
};

export type GeoCoordinates = {
  lat: number,
  lng: number,
};
