import { Image } from "types";

export interface IApiService {
    uploadImage(file: File): Image;
}

class ApiService implements IApiService {
    uploadImage(file: File): Image {
        throw new Error("Method not implemented.");
    }

}

export const apiService = new ApiService();