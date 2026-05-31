import {AxiosResponse} from "axios";
import {api, storageApi} from "../http/api";
import {Image} from "../model/ApiModel";

export class PresignedResponse {
    constructor(public readonly presigned: string) {}
}

export class ImagesResponse {
    constructor(public readonly images: Array<Image>) {}
}

export default class ImageService {
    static async changeVisibility(link: string, newIsVisible: boolean): Promise<AxiosResponse<void>> {
        console.log(link);
        return await api.patch("/link/visibility", null, {
            params: {
                "link": link,
                "set-is_private": newIsVisible
            }
        });
    }

    static async getImages(): Promise<AxiosResponse<ImagesResponse>> {
        return await api.get("/images");
    }

    static async getImage(link: string): Promise<AxiosResponse<Blob>> {
        return await api.get("/image", {
            responseType: 'blob',
            params: {
                "link": link,
            }
        });
    }

    static async saveImage(name?: string): Promise<AxiosResponse<PresignedResponse>> {
        return await api.post<PresignedResponse>("/save", null, {params: {"name": name}});
    }

    static async putImage(presigned: string, image: Blob): Promise<AxiosResponse<void>> {
        return await storageApi.put(presigned, image, { headers: { "Content-Type": "image/png" } });
    }

    static async createLink(imageId: string): Promise<AxiosResponse<string>> {
        console.log(imageId);
        return await api.post("/create-link", null, {
            params: {
                "expires-duration": "144h",
                "private": true,
                "image-id": imageId,
            }
        })
    }


}