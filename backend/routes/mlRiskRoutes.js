const express = require("express");

const {
  getMLRiskPrediction,
} = require("../controllers/mlRiskController");

const router = express.Router();

router.post(
  "/projects/:id/ml-risk",
  getMLRiskPrediction
);

module.exports = router;