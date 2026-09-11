const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const progressRoutes = require("./routes/progressRoutes");
const riskRoutes = require("./routes/riskRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
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

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api",
  progressRoutes
);

app.use(
  "/api",
  riskRoutes
);

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