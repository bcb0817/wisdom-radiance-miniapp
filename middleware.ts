import {NextRequest,NextResponse} from "next/server";
export function middleware(request:NextRequest){if(request.nextUrl.pathname.startsWith("/admin")&&request.nextUrl.pathname!=="/admin/login"&&request.cookies.get("wr_admin")?.value!=="authenticated")return NextResponse.redirect(new URL("/admin/login",request.url));return NextResponse.next()}
export const config={matcher:["/admin/:path*"]};
