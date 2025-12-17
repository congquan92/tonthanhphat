import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // const token = request.cookies.get("session_token")?.value;
    // //  Nếu không có token trong cookie, chặn luôn cho lẹ
    // if (!token) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }
    // // Nếu có token, gọi sang Backend kiểm tra xem token còn hạn không
    // const response = await fetch("https://api.your-backend.com/v1/verify", {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // });
    // // Nếu Backend bảo token fake hoặc hết hạn
    // if (!response.ok) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }
    // // Nếu mọi thứ ok, cho qua
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/profile/:path*"],
};
