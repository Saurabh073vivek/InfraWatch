const Project = require("../models/Project");
const RiskPrediction = require("../models/RiskPrediction");

const {
  executeAuthoritativeRiskPrediction,
} = require("./mlRiskController");

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

    const result =
      await executeAuthoritativeRiskPrediction(id);

    res.status(200).json({
      success: true,
      message:
        "Authoritative risk prediction generated successfully",

      prediction: result.prediction,

      project: {
        id: result.project._id,
        projectCode:
          result.project.projectCode,
        name: result.project.name,
        riskScore:
          result.project.riskScore,
        riskLevel:
          result.project.riskLevel,
        status:
          result.project.status,
      },
    });
  } catch (error) {
    console.error(
      "Risk Prediction Error:",
      error.message
    );

    res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to generate risk prediction",
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

      risk: prediction
        ? {
            riskScore: prediction.riskScore,
            riskLevel: prediction.riskLevel,
            confidence: prediction.confidence,
            progressGap: prediction.progressGap,
            costEscalation: prediction.costEscalation,
            predictionDate: prediction.predictionDate,
          }
        : null,

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