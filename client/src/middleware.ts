import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Nếu không có cả 2 token -> Đuổi thẳng cổ về login
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    // Còn lại (có access, hoặc chỉ có refresh) -> Cho qua hết
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
