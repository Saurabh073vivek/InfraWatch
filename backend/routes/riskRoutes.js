const express = require("express");

const {
  predictProjectRisk,
  getProjectRisk,
  getHighRiskProjects,
} = require("../controllers/riskController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Generate risk prediction
router.post(
  "/projects/:id/risk",
  protect,
  predictProjectRisk
);

// Get latest project risk
router.get(
  "/projects/:id/risk",
  protect,
  getProjectRisk
);

// Get high-risk projects
router.get(
  "/risks/high",
  protect,
  getHighRiskProjects
);

module.exports = router;