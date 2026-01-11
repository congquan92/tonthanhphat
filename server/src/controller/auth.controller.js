import { AuthService } from "../services/auth.service.js";
import { Helper } from "../lib/helper.js";

export const AuthController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const tokens = await AuthService.login(email, password);
            res.cookie("accessToken", tokens.accessToken, {
                ...Helper.cookieOptions(),
                maxAge: 15 * 60 * 1000, // 15 phút
            });
            res.cookie("refreshToken", tokens.refreshToken, {
                ...Helper.cookieOptions(),
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });

            return res.json({ success: true, message: "Đăng nhập thành công" });
        } catch (error) {
            if (error.message === "INVALID_CREDENTIALS") {
                return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác" });
            }
            res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error });
            console.error(error);
        }
    },

    refreshToken: async (req, res) => {
        try {
            // Lấy token từ cookies
            const oldRefreshToken = req.cookies.refreshToken;
            if (!oldRefreshToken) {
                return res.status(401).json({ success: false, message: "Yêu cầu đăng nhập lại" });
            }
            const newTokens = await AuthService.refreshToken(oldRefreshToken);
            // Cập nhật lại 2 cookie mới (Rotation)
            res.cookie("accessToken", newTokens.accessToken, { ...Helper.cookieOptions(), maxAge: 15 * 60 * 1000 });
            res.cookie("refreshToken", newTokens.refreshToken, { ...Helper.cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 });

            return res.json({ success: true, message: "Token đã được làm mới" });
        } catch (error) {
            return res.status(403).json({ success: false, message: "Phiên đăng nhập hết hạn" });
        }
    },

    logout: async (req, res) => {
        // Xóa sạch cookies khi người dùng đăng xuất
        res.clearCookie("accessToken", Helper.cookieOptions());
        res.clearCookie("refreshToken", Helper.cookieOptions());
        return res.json({ success: true, message: "Đăng xuất thành công" });
    },

    changePassword: async (req, res) => {
        try {
            const userId = req.user.userId; // Lấy userId từ middleware
            const { oldPassword, newPassword } = req.body;
            await AuthService.changePassword(userId, oldPassword, newPassword);
            return res.json({ success: true, message: "Đổi mật khẩu thành công" });
        } catch (error) {
            if (error.message === "INCORRECT_OLD_PASSWORD") {
                return res.status(400).json({ success: false, message: "Mật khẩu cũ không đúng" });
            } else if (error.message === "USER_NOT_FOUND") {
                return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },
};
