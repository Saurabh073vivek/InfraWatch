const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mlRiskRoutes = require("./routes/mlRiskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const progressRoutes = require("./routes/progressRoutes");
const riskRoutes = require("./routes/riskRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error(
      "MongoDB Connection Error:",
      error.message
    );
  });

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api", mlRiskRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api", progressRoutes);

app.use("/api", riskRoutes);

app.use("/api/users", userRoutes);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "InfraWatch API is running",
  });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});