import { loginFakeAdmin } from './fakeData/loginFakeAdmin';
import { seedLocalDb } from './fakeData/seedLocalDb';

export * from './hooks';
export * from './svg';
export * from './topo';
export * from './context';
export * from './map';
export * from './globals';
export * from './builder';

export * from './readFileAsync';
export * from './distanceBetween';
export * from './markerSize';
export * from './bitflagHelpers';
export * from './formatDate';
export * from './blobToImage';
export * from './jwtDecoder';

export * from './splitArray';
export * from './arrayMove';

// ensures this runs on any page that needs it
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    loginFakeAdmin().then(seedLocalDb);
}