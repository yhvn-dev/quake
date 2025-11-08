import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import eqRoutes from "./routes/eqRoutes.js"
import eqReports from "./routes/reportRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports", eqReports);
app.use("/api/auth", authRoutes);
app.use("/api/eq",eqRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/earthquakes`);
  console.log(
    `🔄 Refresh endpoint: http://localhost:${PORT}/api/earthquakes/refresh`
  );
});


// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    cacheStatus: cachedData ? "populated" : "empty",
    lastFetch: lastFetchTime ? new Date(lastFetchTime).toISOString() : "never",
    cachedCount: cachedData ? cachedData.length : 0,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "PHIVOLCS Earthquake Data API",
    endpoints: {
      "/api/earthquakes": "Get earthquake data (cached for 5 minutes)",
      "/api/earthquakes/refresh": "Force refresh earthquake data",
      "/health": "Health check",
    },
    status: "ready",
  });
});
