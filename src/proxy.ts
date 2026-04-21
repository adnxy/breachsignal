import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Auth protection - uncomment when NextAuth is configured
  // const token = await getToken({ req: request });
  // const { pathname } = request.nextUrl;
  //
  // if (["/auth/signin", "/auth/signup"].some((p) => pathname.startsWith(p))) {
  //   if (token) return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  //
  // if (pathname.startsWith("/dashboard") && !token) {
  //   const signInUrl = new URL("/auth/signin", request.url);
  //   signInUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(signInUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
