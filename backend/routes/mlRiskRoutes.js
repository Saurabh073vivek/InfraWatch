const express = require("express");

const {
  getMLRiskPrediction,
} = require("../controllers/mlRiskController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Generate Random Forest ML risk prediction
router.post(
  "/projects/:id/ml-risk",
  protect,
  getMLRiskPrediction
);

module.exports = router;