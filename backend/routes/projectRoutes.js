const express = require("express");

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET all projects
router.get("/", protect, getProjects);

// GET single project
router.get("/:id", protect, getProject);

// CREATE project
router.post("/", protect, createProject);

// UPDATE project
router.put("/:id", protect, updateProject);

// DELETE project - ADMIN ONLY
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProject
);

module.exports = router;