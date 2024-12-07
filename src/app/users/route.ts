import { User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma-client";
import { passwordToHash } from "../lib/password";
import { formRegisterZod } from "@/constants/authZod";
import { TServError } from "@/types/global";
import response from "../lib/response";

export async function POST(request: Request) {
    try{
        const reqData:{[key:string]:any} = await request.json();
        
        const validate = formRegisterZod.safeParse(reqData);
        if(!validate.success){
            console.log('validate.error = ', validate.error.issues);
            //setErrValid(validate.error.issues);
            //const typeErr: TServError = 'validation';
            return response({
                data: validate.error.issues,
                typeErr: 'validation',
                status: 400
            });
            //return Response.json({data: validate.error.issues, typeErr}, {status:400});
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
        //const typeErr: TServError = 'server';
        return response({
            data: (err as Error).message,
            typeErr: 'validation',
            status: 400
        });
        //return new Response(JSON.stringify({data: (err as Error).message, typeErr}), {status:400});
    }
    
}