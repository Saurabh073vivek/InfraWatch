const Project = require("../models/Project");

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};


// GET SINGLE PROJECT
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};


// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const project = await Project.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};


// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};


// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};


// ==========================================
// ML RISK PREDICTION
// ==========================================
const predictMLRisk = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const plannedProgress = Number(project.plannedProgress ?? 0);
    const actualProgress = Number(project.physicalProgress ?? 0);

    const progressGap = plannedProgress - actualProgress;

    const approvedCost = Number(project.approvedCost ?? 0);
    const revisedCost = Number(project.revisedCost ?? approvedCost);

    const expenditure = Number(project.expenditure ?? 0);

    const financialProgress = Number(
      project.financialProgress ?? 0
    );

    // Call Python FastAPI ML service
    const mlResponse = await fetch(
      "http://127.0.0.1:8000/predict-risk",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          physicalProgress: actualProgress,
          financialProgress,
          plannedProgress,
          actualProgress,
          approvedCost,
          revisedCost,
          expenditure,
        }),
      }
    );

    const mlResult = await mlResponse.json();

    if (!mlResponse.ok) {
      return res.status(500).json({
        success: false,
        message: "ML Service prediction failed",
        error: mlResult,
      });
    }

    const prediction = mlResult.prediction;

    // Update project with ML prediction
    project.riskScore = prediction.riskScore;
    project.riskLevel = prediction.riskLevel;

    await project.save();

    return res.status(200).json({
      success: true,

      project: {
        id: project._id,
        projectCode: project.projectCode,
        name: project.name,
      },

      input: {
        physicalProgress: actualProgress,
        financialProgress,
        plannedProgress,
        actualProgress,
        approvedCost,
        revisedCost,
        expenditure,
        progressGap: prediction.progressGap,
        costEscalation: prediction.costEscalation,
      },

      prediction: {
        riskScore: prediction.riskScore,
        riskLevel: prediction.riskLevel,
        confidence: prediction.confidence,
        progressGap: prediction.progressGap,
        costEscalation: prediction.costEscalation,
      },
    });

  } catch (error) {
    console.error("ML Risk Prediction Error:", error);

    return res.status(500).json({
      success: false,
      message: "ML risk prediction failed",
      error: error.message,
    });
  }
};


module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  predictMLRisk,
};