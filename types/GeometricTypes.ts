export type Coordinates = {
  id?: number,
  posX: number,
  posY: number,
};

export type Area = {
  id?: number,
  points: Coordinates[],
};

export type GeoCoordinates = {
  id?: number,
  lat: number,
  lng: number,
};
