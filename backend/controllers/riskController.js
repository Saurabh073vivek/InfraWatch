const Project = require("../models/Project");
const RiskPrediction = require("../models/RiskPrediction");

const {
  calculateRisk,
} = require("../services/riskEngine");

// ==========================================
// PREDICT PROJECT RISK
// POST /api/projects/:id/risk
// ==========================================

const predictProjectRisk = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Calculate risk
    const risk = await calculateRisk(
      project
    );

    // Save prediction
    const prediction =
      await RiskPrediction.create({
        projectId: project._id,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        progressGap: risk.progressGap,
        costEscalation:
          risk.costEscalation,
        factors: risk.factors,
        predictionSource:
          "Rule Engine",
      });

    // Update project
    project.riskScore =
      risk.riskScore;

    project.riskLevel =
      risk.riskLevel;

    // Automatically update status
    if (
      risk.riskLevel === "Critical" ||
      risk.riskLevel === "High"
    ) {
      project.status = "At Risk";
    }

    await project.save();

    res.status(200).json({
      success: true,
      message:
        "Risk prediction generated successfully",

      prediction,

      project: {
        id: project._id,
        projectCode:
          project.projectCode,
        name: project.name,
        riskScore:
          project.riskScore,
        riskLevel:
          project.riskLevel,
        status:
          project.status,
      },
    });
  } catch (error) {
    console.error(
      "Risk Prediction Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate risk prediction",
      error: error.message,
    });
  }
};

// ==========================================
// GET LATEST RISK
// GET /api/projects/:id/risk
// ==========================================

const getProjectRisk = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const prediction =
      await RiskPrediction.findOne({
        projectId: id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      risk: {
        riskScore:
          project.riskScore || 0,

        riskLevel:
          project.riskLevel || "Low",
      },

      prediction:
        prediction || null,
    });
  } catch (error) {
    console.error(
      "Get Risk Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch project risk",
      error: error.message,
    });
  }
};

// ==========================================
// GET HIGH RISK PROJECTS
// GET /api/risks/high
// ==========================================

const getHighRiskProjects =
  async (req, res) => {
    try {
      const projects =
        await Project.find({
          riskLevel: {
            $in: [
              "High",
              "Critical",
            ],
          },
        }).sort({
          riskScore: -1,
        });

      res.status(200).json({
        success: true,
        count: projects.length,
        projects,
      });
    } catch (error) {
      console.error(
        "High Risk Projects Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch high-risk projects",
        error: error.message,
      });
    }
  };

module.exports = {
  predictProjectRisk,
  getProjectRisk,
  getHighRiskProjects,
};