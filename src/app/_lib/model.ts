import db from 'better-sqlite3'
import { InputUser, IUser } from './types'
const sql = new db('auth.db')

export const getUserByLogin = (login:string):(IUser|null) => {
    const user = sql.prepare("SELECT * FROM users WHERE login = ?").get(login)
    if(user){
        return user as IUser
    }
    return null
}

export const getAllUsers = () => {
    return sql.prepare("SELECT * FROM users").all()
}

export const insertUser = (user:InputUser):db.RunResult => {
    return sql.prepare(`INSERT INTO users(name, surname, login, password, attempts)
                        VALUES(@name, @surname, @login, @password, @attempts)                    
    `).run(user)
}

export const createSession = (userId: number, token: string) => {
    return sql.prepare(`INSERT INTO session(id, user_id, expires)
                        VALUES(?, ?, ?)`).run(token, userId, Date.now() + 5000)
}

export const getVerifyUser = (token: string) => {
    const user = sql.prepare(`SELECT * FROM session WHERE id = ?`).get(token)

    if(!user) {
        return null
    }

    return user
}

export const updateExpire = (token: string, expires: number) => {
    return sql.prepare(`UPDATE session SET expires = ? WHERE id = ?`).run(expires + 5000, token)
}

export const getUserById = (userId: number): (IUser | null) => {
    const user = sql.prepare(`SELECT * FROM users WHERE id = ?`).get(userId)

    if(!user) {
        return null
    }

    return user as IUser
}

export const deleteUserInSession = (token: string) => {
    return sql.prepare(`DELETE FROM session WHERE id = ?`).run(token)
} 

export const incrementAttempts = (id: number, attempts: number) => {
    return sql.prepare(`UPDATE users SET attempts = ? WHERE id = ?`).run(attempts + 1, id)
}


export const addBlockingTimer = (id: number, time: number) => {
    return sql.prepare(`UPDATE users SET time = ? WHERE id = ?`).run(time, id)
}

export const updateData = (id: number) => {
    return sql.prepare(`UPDATE users SET attempts = ?, time = ? WHERE id = ?`).run(0, null, id)
}