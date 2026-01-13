import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import contactInfRoutes from "./routes/contactInf.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import bannerRoutes from "./routes/banner.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

app.use(express.json({ limit: "50mb" })); // Tăng limit cho upload ảnh base64
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // Cho phép gửi cookie cùng với yêu cầu
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/info", contactInfRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/posts", postRoutes);

export default app;

