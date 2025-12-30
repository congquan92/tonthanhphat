import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    // Lấy từ cookies
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: Vui lòng đăng nhập" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded; // userId trong token
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token hết hạn hoặc không hợp lệ", code: "ACCESS_TOKEN_EXPIRED" });
    }
};
