import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import notesRoutes from "./routes/voiceNoteRoute.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://*.vercel.app"]
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(cors));

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

// // Serve static files from React build (for production)
// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "..", "frontend", "build");
//   app.use(express.static(frontendPath));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// }

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: "Validation failed", details: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  res.status(500).json({ error: "Internal server error" });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
// For development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
