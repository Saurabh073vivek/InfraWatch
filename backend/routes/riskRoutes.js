const express = require("express");

const {
  predictProjectRisk,
  getProjectRisk,
  getHighRiskProjects,
} = require("../controllers/riskController");

const router = express.Router();

// Generate risk prediction
router.post(
  "/projects/:id/risk",
  predictProjectRisk
);

// Get latest project risk
router.get(
  "/projects/:id/risk",
  getProjectRisk
);

// Get high-risk projects
router.get(
  "/risks/high",
  getHighRiskProjects
);

module.exports = router;