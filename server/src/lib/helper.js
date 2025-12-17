import jwt from "jsonwebtoken";

export const Helper = {
    generateTokens: (userId) => {
        const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        });
        const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    },
    cookieOptions: () => ({
        httpOnly: true, // Ngăn chặn XSS, JavaScript không thể đọc được
        secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS khi chạy production
        sameSite: "strict", // Chống tấn công CSRF
        path: "/",
    }),
};
