import { User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma-client";
import { passwordToHash } from "../lib/password";
import { formRegisterZod } from "@/constants/authZod";

export async function POST(request: Request) {
    try{
        const reqData:{[key:string]:any} = await request.json();
        
        const validate = formRegisterZod.safeParse(reqData);
        if(!validate.success){
            console.log('validate.error = ', validate.error.issues);
            //setErrValid(validate.error.issues);
            //return new Response(JSON.stringify({message: (err as Error).message}), {status:400});
            return Response.json(validate.error.issues, {status:400});
        }
        delete reqData['repeatPassword'];
        reqData['phone'] = '+380'+reqData['phone'];
        reqData['password'] = passwordToHash(reqData['password']);
        console.log('userData = ', reqData);
        const newUser = await prisma.user.create({data:reqData as User});
        //const newUser = await prisma.user.create(userData);
        console.log('newUser = ', newUser);
        return Response.json({message: 'success'});
    }catch(err){
        return new Response(JSON.stringify({message: (err as Error).message}), {status:400});
    }
    
}