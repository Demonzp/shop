import { User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma-client";
import { passwordToHash } from "../lib/password";
import { formRegisterZod } from "@/constants/authZod";
import response from "../lib/response";
import { createId } from "../lib/global";

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

        const userByEmail = await prisma.user.findFirst({
            where:{
                email: reqData['email']
            }
        });

        if(userByEmail){
            return response({
                data: [{path:['email'],message:'Пользователь с такой електронной почтой уже зарегистрирован!'}],
                typeErr: 'validation',
                status: 400
            });
        }
        
        if(reqData['phone'].length>0){
            const userByPhone = await prisma.user.findFirst({
                where:{
                    phone: '+380'+reqData['phone']
                }
            });
    
            if(userByPhone){
                return response({
                    data: [{path:['phone'],message:'Пользователь с таким номером уже зарегистрирован!'}],
                    typeErr: 'validation',
                    status: 400
                });
            }
            reqData['phone'] = '+380'+reqData['phone'];
        }
        delete reqData['repeatPassword'];
        reqData['password'] = passwordToHash(reqData['password']);
        reqData['uid'] = createId();
        //reqData['uid'] = '123';
        //console.log('userData = ', reqData);
        await prisma.user.create({data:reqData as User});
        //const newUser = await prisma.user.create(userData);
        //console.log('newUser = ', newUser);
        return Response.json({message: 'success'});
    }catch(err){
        //const typeErr: TServError = 'server';
        return response({
            data: (err as Error).message,
            typeErr: 'server',
            status: 400
        });
        //return new Response(JSON.stringify({data: (err as Error).message, typeErr}), {status:400});
    }
    
}