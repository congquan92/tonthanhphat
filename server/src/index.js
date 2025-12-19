import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // Cho phép gửi cookie cùng với yêu cầu
    })
);

app.use("/api/auth", authRoutes);

export default app;
