import response from "@/app/lib/response";
import { formLoginZod } from "@/constants/authZod";
import { prisma } from "../../../../../prisma/prisma-client";
import { comparePassword } from "@/app/lib/password";
import { secretForJoes, userDataToOwner } from "@/app/lib/user";
import { cookies } from "next/headers";
import { userAgent } from "next/server";
import * as jose from 'jose';

export async function POST(request: Request) {
    try{
        const data = await request.json();
        //const { os, device, browser } = userAgent(request);
        console.log('data = ', data);
        const validate = formLoginZod.safeParse(data);
        if(!validate.success){
            console.log('validate.error = ', validate.error.issues);
            //setErrValid(validate.error.issues);
            //const typeErr: TServError = 'validation';
            return response({
                data: validate.error.issues,
                typeErr: 'validation',
                status: 400
            });
        }

        const user = await prisma.user.findFirst({
            where:{
                email: data['email']
            }
        });

        if(!user){
            return response({
                data: [{path:['email'],message:'Неверный логин или пароль'}],
                typeErr: 'validation',
                status: 400
            });
        }

        if(!comparePassword(user.password, data['password'])){
            return response({
                data: [{path:['email'],message:'Неверный логин или пароль'}],
                typeErr: 'validation',
                status: 400
            });
        }

        const userRes = userDataToOwner(user);
        
        const sessionData:TSessionData = {
            uid: userRes.uid,
            name: userRes.firsName
        };
        const time = Math.floor(Date.now() / 1000) + 60*60*24*10;
        
        const token = await new jose.SignJWT(sessionData)
            .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
            .setIssuedAt()
            .setExpirationTime('2m')
            .sign(secretForJoes());
        //const token = jwt.sign({data: sessionData}, process.env.TOKEN_SALT as string, { expiresIn: 60 * 2 });
        
        const { os, device, browser } = userAgent(request);
        const agent = String(device.vendor)+' '
            +String(device.model)+' '
            +String(device.type)+' '
            +String(os.name)+' '
            +String(os.version)+' '
            +String(browser.name)+' '
            +String(browser.version);

        const sessionDB = {
            userId: user.id,
            agent,
            token,
            expiration: time
        };
        
        //console.log(agent);
        await prisma.session.create({data:sessionDB});
        
        const cookieStore = await cookies();
        cookieStore.set('stkey',token,{
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 10,
            path: '/',
        });
        //console.log('user = ', user);
        return Response.json(userRes);
    }catch(err){
        return response({
            data: (err as Error).message,
            typeErr: 'server',
            status: 400
        });
    }
    
}