export interface IUser{
    id:number
    name:string
    surname:string
    login:string
    password:string
    attempts: number
    time: number
}

export interface InputUser {
    name:string
    surname:string
    login:string
    password:string
    attempts: number
}

export interface IToken {
    id: string
    user_id: number
    expires: number
}