import { NextRequest, NextResponse } from 'next/server';
//import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { secretForJoes, updateToken } from './app/lib/user';
import { JOSEError } from 'jose/errors';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = [
  '/login',
  '/signup',
  '/'
];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  //const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('stkey')?.value;
  console.log('cookie = ', cookie);
  //const session = await decrypt(cookie)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  if ((path === '/signin' || path === '/signup') && cookie) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  let response = NextResponse.next();

  if (cookie) {
    //updateToken(cookie);
    try {
      //const salt:string = process.env.TOKEN_SALT as string;

      const decoded = await jose.jwtVerify(cookie, secretForJoes());
      console.log('decoded = ', decoded);
    } catch (err) {
      if (err instanceof jose.errors.JWTExpired) {
        if (err.payload.hasOwnProperty('uid')&&err.payload.hasOwnProperty('name')) {
          //console.log(err.payload);
          try {
            console.log('token start Update!');
            await updateToken(err.payload.uid as string, err.payload.name as string, req, cookie);
            console.log('token is Update!');
          } catch (error) {
            console.log('error update token must delete cookie');
            response.cookies.delete('isAuth');
            response.cookies.delete('stkey');
          }
          
        }
        // ...
      } else {
        console.log('must delete cookie');
        response.cookies.delete('isAuth');
        response.cookies.delete('stkey');
      }
      // if((err as JOSEError).code==='ERR_JWT_EXPIRED'){
      //   if((err as JOSEError).cause){
      //     //(err as JOSEError).cause.
      //   }
      //   console.log('message = ', (err as JOSEError).message);
      //   console.log('name = ', (err as JOSEError).name);
      //   console.log('stack = ', (err as JOSEError).stack);
      //   console.log('cause = ', (err as JOSEError).cause);
      // }else{
      //   console.log('must delete cookie');
      //   response.cookies.delete('isAuth');
      //   response.cookies.delete('stkey');
      // }
      //console.log('jwt err = ', (err as JOSEError).code);
      //console.log('message = ', (err as JOSEError).message);
      //console.log('name = ', (err as JOSEError).name);
      //console.log('stack = ', (err as JOSEError).stack);
      //console.log('cause = ', (err as JOSEError).cause);
    }
  }


  if (cookie) {
    response.cookies.set('isAuth', 'true');
  } else {
    response.cookies.set('isAuth', 'false');
  }

  //return NextResponse.next();
  return response;
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};