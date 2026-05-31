import {UUID} from "node:crypto";


export type AccessToken = string

export class Image{
    public constructor(
        public readonly id: UUID,
        public readonly name: string,
        public readonly link: string,
        public readonly isPrivate: boolean,
    ){}
}