import { NextRequest, NextResponse } from 'next/server';
//import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { secretForJoes } from './app/lib/user';
 
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
 
  if((path==='/signin'||path==='/signup')&&cookie){
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if(cookie){
    //updateToken(cookie);
    try {
      //const salt:string = process.env.TOKEN_SALT as string;

      const decoded = await jose.jwtVerify(cookie, secretForJoes());
      console.log('decoded = ', decoded);
    } catch(err) {
      console.log('jwt err = ', err);
    }
  }
  
  let response = NextResponse.next();
  if(cookie){
    response.cookies.set('isAuth', 'true');
  }else{
    response.cookies.set('isAuth', 'false');
  }
  
  //return NextResponse.next();
  return response;
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};