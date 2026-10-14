require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const { globalLimiter } = require("./middleware/rateLimiter");

// ---- Fail fast if required secrets are missing ----
["MONGO_URI", "JWT_SECRET", "GEMINI_API_KEY"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();

// Render / Vercel / any reverse proxy: needed so rate limiting sees the real client IP
app.set("trust proxy", 1);

app.use(helmet());

// ---- CORS: only allow known frontends ----
const allowedOrigins = (
  process.env.CLIENT_URL ||
  "https://ai-travel-planner-ten-sandy.vercel.app,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = server-to-server / curl / health checks
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(globalLimiter);

app.get("/", (req, res) => {
  res.send("AI Travel Planner Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// ---- 404 ----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---- Central error handler (never leak internals) ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body too large" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
