const express = require("express");

const {
  getProjectProgress,
  addProgress,
} = require("../controllers/progressController");

const router = express.Router();

// GET project progress
router.get(
  "/projects/:id/progress",
  getProjectProgress
);

// ADD project progress
router.post(
  "/projects/:id/progress",
  addProgress
);

module.exports = router;