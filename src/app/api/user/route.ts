import { deleteUserInSession } from "@/app/_lib/model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export const DELETE = async (req: NextRequest) => {
    const tokenData = (await cookies()).get('token')

    if(!tokenData) {
        return Response.json({status: 'error'})
    }

    const user = await deleteUserInSession(tokenData.value)

    if(user.changes !== 1) {
        return Response.json({status: 'error'})
    }else {
        (await cookies()).delete('token')
    }

    return Response.json({status: 'ok'})
}