import {AccessToken} from "../model/ApiModel";
import {AxiosResponse} from "axios";
import {gatewayApi} from "../http/api";

export default class AuthService {
    static async registration(username: string, password: string): Promise<AxiosResponse<AccessToken>> {
        const data = {
            "username": username,
            "password": password
        }
        console.log(data)
        return await gatewayApi.post<AccessToken>("/auth/registration", data);
    }

    static async login(username: string, password: string): Promise<AxiosResponse<AccessToken>> {
        const data = {
            username: username,
            password: password
        }
        return await gatewayApi.post<AccessToken>("/auth/login", data);
    }
}