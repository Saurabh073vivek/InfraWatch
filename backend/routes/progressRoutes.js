const express = require("express");

const {
  getProjectProgress,
  addProgress,
} = require("../controllers/progressController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET project progress
router.get(
  "/projects/:id/progress",
  protect,
  getProjectProgress
);

// ADD project progress
router.post(
  "/projects/:id/progress",
  protect,
  addProgress
);

module.exports = router;