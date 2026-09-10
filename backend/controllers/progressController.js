const Progress = require("../models/Progress");
const Project = require("../models/Project");

// ==========================================
// GET PROGRESS FOR A PROJECT
// GET /api/projects/:id/progress
// ==========================================

const getProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const progress = await Progress.find({
      projectId: id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error(
      "Get Progress Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
};

// ==========================================
// ADD PROGRESS
// POST /api/projects/:id/progress
// ==========================================

const addProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      month,
      plannedProgress,
      actualProgress,
      expenditure,
      remarks,
    } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      !month ||
      plannedProgress === undefined ||
      actualProgress === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Month, planned progress and actual progress are required",
      });
    }

    const progress = await Progress.create({
      projectId: id,
      month,
      plannedProgress,
      actualProgress,
      expenditure: expenditure || 0,
      remarks: remarks || "",
    });

    // Update project's current physical progress
    project.physicalProgress = actualProgress;

    await project.save();

    res.status(201).json({
      success: true,
      message: "Progress added successfully",
      progress,
    });
  } catch (error) {
    console.error(
      "Add Progress Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to add progress",
      error: error.message,
    });
  }
};

module.exports = {
  getProjectProgress,
  addProgress,
};