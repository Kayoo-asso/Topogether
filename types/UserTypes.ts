import { ImageAfterServer } from "./ImageTypes";

export type User = {
    pseudo: string,
    email: string,
    role: string,
    profilePicture?: ImageAfterServer,
    firstName?: string,
    lastName?: string,
    phone?: string,
    birthDate?: string,
    gender?: string,
    citizenship?: string,
    city?: string,
    isAcceptingNewsInfos?: boolean,
    password?: string,
    update?: () => void,
};

export type Role = 'ADMIN' | 'USER';