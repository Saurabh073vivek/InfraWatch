const express = require("express");

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();


// GET all projects
router.get("/", getProjects);


// GET single project
router.get("/:id", getProject);


// CREATE project
router.post("/", createProject);


// UPDATE project
router.put("/:id", updateProject);


// DELETE project
router.delete("/:id", deleteProject);


module.exports = router;