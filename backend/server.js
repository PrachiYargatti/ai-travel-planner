require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const tripRoutes = require("./routes/tripRoutes");

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("AI Travel Planner Backend Running");
});

const PORT = process.env.PORT || 5000;
console.log(process.env.GEMINI_API_KEY);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});