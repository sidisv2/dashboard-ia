import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  if (!isAuth) {
    const url = req.nextUrl.clone();
    const callbackUrl = url.pathname + url.search;
    url.pathname = '/';
    url.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/inbox/:path*', '/metrics/:path*'],
};
