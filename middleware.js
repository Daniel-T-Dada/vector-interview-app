import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if the user is authenticated
    const isAuthenticated = !!token;

    // Get the pathname of the request
    const pathname = request.nextUrl.pathname;

    // Allow access to authentication routes
    if (pathname.startsWith("/auth")) {
        // If user is already authenticated and trying to access auth pages, redirect to dashboard
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Allow public access to the homepage
    if (pathname === "/") {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
}; 