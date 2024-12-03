"use server"

import { redirect } from "next/navigation"
import { addBlockingTimer, createSession, deleteUserInSession, getUserById, getUserByLogin, getVerifyUser, incrementAttempts, insertUser, updateData, updateExpire } from "./model"
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid"
import { cookies } from "next/headers"
import { IToken, IUser } from "./types"

interface IState{
    message:string
}

export const handleSignup = async (prevState:IState,form:FormData) => {
    const name = form.get("name") as string
    const surname = form.get("surname") as string
    const login = form.get("login") as string
    let password = form.get("password") as string
    let attempts = 0

    if(!name.trim() || !surname.trim() || !login.trim() || !password.trim()){
        return {message:"Please fill all the fields"}
    }

    if(password.length < 6){
        return {message:"Password is too short!!!"}
    }

    const found = getUserByLogin(login)
    if(found){
        return {message:"Login is busy!"}
    }

    password = await bcrypt.hash(password, 10)

    const result = insertUser({login, password, name, surname, attempts})
    if(result.changes){
        return redirect("/login")
    }else{
        return {message:"Internal server error!"}
    }
}

export const handleLogin = async (prevState: IState, form: FormData) => {
    const login = form.get('login') as string;
    const password = form.get('password') as string;

    const found = getUserByLogin(login)

    if (!found) {
        return { message: 'Login is incorrect' }
    }

    
    if (found.attempts >= 3) {
        const time = Date.now() - found.time
        const minute = Math.ceil((120000 - time) / 60000)

        if (time < 120000) {
            return { message: `Your profile is blocked. Please try again in ${minute} minute(s).` }
        }

        
        await updateData(found.id)
    }

    
    const result = await bcrypt.compare(password, found.password);

    if (!result) {
        if (found.attempts < 3) {
            await incrementAttempts(found.id, found.attempts);
        }

        if (found.attempts === 2) {
            await addBlockingTimer(found.id, Date.now());
            return { message: 'Your profile access has been blocked for 2 minutes.' };
        }

        return { message: 'Password is incorrect' };
    }

    
    const token = nanoid()
    createSession(found.id, token)

    ;(await cookies()).set('token', token, {
        httpOnly: true,
    })

    await updateData(found.id)

    return redirect('/profile')
};




export const verifyUser = async () => {
    const tokenData = (await cookies()).get('token')

    if(!tokenData) {
        return null
    }

    const userData = await getVerifyUser(tokenData.value) as IToken

    if(!userData || userData.expires < Date.now()) {
        return null
    }
     
        
    const expire = await updateExpire(tokenData.value, userData.expires)
    

    const result = expire.changes == 1 && await getUserById(userData.user_id)


    return result as IUser
}

