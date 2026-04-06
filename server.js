import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import recordRoutes from "./src/routes/recordRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import errorHandler from "./src/utils/errorHandler.js";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

await connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Finance Dashboard API is running" });
});

app.use(errorHandler);

app.listen(4000, () => {
  console.log(`Server running on port 4000`);
});
