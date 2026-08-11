import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/admin" && !pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";

  const token = await getToken({ req: request });

  if (isLoginPage) {
    if (token?.role === "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!token || token.role !== "ADMIN") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
