import { User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma-client";
import { passwordToHash } from "../lib/password";

export async function POST(request: Request) {
    try{
        const reqData:{[key:string]:any} = await request.json();
        delete reqData['repeat-password'];
        // if(reqData['second-name']===''){
        //     delete reqData['second-name'];
        // }
        const userData:{[key:string]:any} = {};
        for (const key in reqData) {
            userData[key.replace(/-./g, x=>x[1].toUpperCase())] = reqData[key];
        }
        userData['phone'] = '+380'+userData['phone'];
        userData['password'] = passwordToHash(userData['password']);
        console.log('userData = ', userData);
        const newUser = await prisma.user.create({data:userData as User});
        //const newUser = await prisma.user.create(userData);
        console.log('newUser = ', newUser);
        return Response.json({message: 'success'});
    }catch(err){
        return new Response(JSON.stringify({message: (err as Error).message}), {status:400});
    }
    
}