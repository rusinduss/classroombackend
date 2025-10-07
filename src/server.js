import express from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/course.js";
import enrollmentRoutes from "./routes/enrollment.js";
import gptRoutes from "./routes/gpt.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Connect to MongoDB
connectDB();

const app = express();

// Debugging log for env
console.log("🔑 OpenAI key loaded:", process.env.OPENAI_API_KEY?.slice(0, 10) + "...");

app.use(cors({ origin: "https://classroomprojec.netlify.app", credentials: true }));  /*http://localhost:5173*/
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/gpt", gptRoutes);
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
