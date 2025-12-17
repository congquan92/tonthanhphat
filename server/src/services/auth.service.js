import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { Helper } from "../lib/helper.js";

export const AuthService = {
    login: async (email, password) => {
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        // Throw lỗi để Controller xử lý catch
        if (!admin) throw new Error("INVALID_CREDENTIALS");

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) throw new Error("INVALID_CREDENTIALS");

        return Helper.generateTokens(admin.id);
    },

    refreshToken: async (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
            const admin = await prisma.adminUser.findUnique({
                where: { id: decoded.userId },
            });

            if (!admin) throw new Error("USER_NOT_FOUND");

            return Helper.generateTokens(admin.id);
        } catch (error) {
            if (error.name === "TokenExpiredError") throw new Error("TOKEN_EXPIRED");
            throw new Error("INVALID_TOKEN");
        }
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        const admin = await prisma.adminUser.findUnique({ where: { id: userId } });
        if (!admin) throw new Error("USER_NOT_FOUND");

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) throw new Error("INCORRECT_OLD_PASSWORD");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.adminUser.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return true;
    },
};
