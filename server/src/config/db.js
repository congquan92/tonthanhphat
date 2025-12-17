import { PrismaClient } from "@prisma/client";

// Khởi tạo client
export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
