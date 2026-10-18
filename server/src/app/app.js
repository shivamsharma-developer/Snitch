import express from "express";
import authRoutes from "../routes/auth.routes.js";
import productRoutes from "../routes/product.route.js";
import cookieParser from "cookie-parser";
import cartRoutes from "../routes/cart.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

export default app;
