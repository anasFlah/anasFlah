import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Protect /admin routes by checking for the presence of the cookie only.
    // Avoid JWT verification here because middleware runs in the Edge runtime
    // where Node.js crypto apis used by jsonwebtoken are not available.
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Always allow access to login page (with trailing slash due to Next.js config)
        if (request.nextUrl.pathname === '/admin/login/') {
            return NextResponse.next();
        }

        // Check for admin token cookie
        const adminToken = request.cookies.get('admin_token')?.value;
        if (!adminToken) {
            // Redirect to login with trailing slash to match Next.js config
            const loginUrl = new URL('/admin/login/', request.url);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*'
    ],
};


