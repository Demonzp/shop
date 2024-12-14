import { Session, User } from '@prisma/client';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, userAgent } from 'next/server';
import { prisma } from '../../../prisma/prisma-client';

export const userDataToOwner = (user: User) => {
    return {
        uid: user.uid,
        email: user.email,
        firsName: user.firstName,
        secondName: user.secondName,
        phone: user.phone,
        verified: user.verified,
    }
}

export const updateToken = async (uid: string, name: string, request: NextRequest, oldToken: string) => {
    const token = await new jose.SignJWT({ uid, name })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('2m')
        .sign(secretForJoes());

    const { os, device, browser } = userAgent(request);

    const agent = String(device.vendor) + ' '
        + String(device.model) + ' '
        + String(device.type) + ' '
        + String(os.name) + ' '
        + String(os.version) + ' '
        + String(browser.name) + ' '
        + String(browser.version);
    console.log('agent = ', agent);
    let userDbSession:Session|null;
    try {
        userDbSession = await prisma.session.findFirst({
            where: {
                token: oldToken,
                agent
            }
        });
    
        if (!userDbSession) {
            return Promise.reject('user not found!');
        }
    } catch (error) {
        console.log(error);
        return Promise.reject('some error!');
    }
    
    console.log('userDbSession = ', userDbSession.userId);
    const sessionDB = {
        userId: userDbSession.userId,
        agent,
        token,
        expiration: userDbSession.expiration
    };

    await prisma.session.update({
        where: {
            id: userDbSession.id
        },
        data: sessionDB
    });
    console.log('prisma.session.update = ');
    const cookieStore = await cookies();
    console.log('cookieStore');
    //const stkey = cookieStore.get('stkey');
    cookieStore.set('stkey', token, {
        httpOnly: true,
        secure: true,
        maxAge: userDbSession.expiration,
        path: '/',
    });

    return 'success!';

    //cookieStore.delete('stkey');
};

//export const secretForJoes = ()=> new TextEncoder().encode('dawd');

export const secretForJoes = () => new TextEncoder().encode(process.env.TOKEN_SALT as string);