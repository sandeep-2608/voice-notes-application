import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import notesRoutes from "./routes/voiceNoteRoute.js";

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://voice-notes-application.vercel.app",
    "https://*.vercel.app",
    "https://vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Voice Notes API Server",
    status: "Running",
    endpoints: [
      "GET /api/health",
      "GET /api/notes",
      "POST /api/notes",
      "PUT /api/notes/:id",
      "DELETE /api/notes/:id",
      "POST /api/notes/:id/summary",
    ],
  });
});

// Test route to check CORS
app.get("/api/test-cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
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

// Start server
const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle process termination gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
