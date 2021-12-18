export type Coordinates = {
  id?: number,
  posX: number | null,
  posY: number | null,
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
