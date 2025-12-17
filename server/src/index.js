import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;
