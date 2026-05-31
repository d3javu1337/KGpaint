import {makeAutoObservable} from "mobx";
import AuthService from "../service/AuthService";
import axios from "axios";
import {api_url} from "../http/api";

export default class Store {


    isAuth = localStorage.getItem('token') !== null
    isLoading = false

    constructor() { makeAutoObservable(this) }

    setIsAuth(isAuth: boolean) {
        this.isAuth = localStorage.getItem('token') !== null;
    }

    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading
    }

    async login(username: string, password: string) {
        this.setIsLoading(true)
        try {
            const response = await AuthService.login(username, password);
            localStorage.setItem('token', response.data)
            this.setIsAuth(true)
        } catch (e) {
            console.error(e)
        } finally {
            this.setIsLoading(false)
        }
    }

    async registration(username: string, password: string) {
        this.setIsLoading(true)
        try {
            const response =
                await AuthService.registration(username, password)
                localStorage.setItem('token', response.data)
                this.setIsAuth(true)
        } catch (e) {
            console.error(e)
        } finally {
            this.setIsLoading(false)
        }
    }

    async checkAuth() {
        this.setIsLoading(true)
        try {
            const response = await axios.get<string>(`${api_url}/auth/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data)
            this.setIsAuth(true)
        } catch (e) {
            console.error(e)
        } finally {
            this.setIsLoading(false)
        }
    }

    async logout() {
        this.setIsLoading(true)
        try {
            localStorage.removeItem('token')
            this.setIsAuth(false)
        } catch (e) {
            console.error(e)
        } finally {
            this.setIsLoading(false)
        }
    }

}