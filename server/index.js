import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import notesRoutes from "./routes/voiceNoteRoute.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// CORS configuration
app.use(cors());

// Body Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/notes", notesRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Voice Notes API is running" });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: "Validation failed", details: error.message });
  }

  res.status(500).json({ error: "Internal server error" });
});

// Catch all API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
// For development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// For production
export default app;
