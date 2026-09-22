const Project = require("../models/Project");
const Progress = require("../models/Progress");
const RiskPrediction = require("../models/RiskPrediction");
const { predictRisk } = require("../services/mlService");

const executeAuthoritativeRiskPrediction = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const latestProgress = await Progress.findOne({
    projectId,
  }).sort({ createdAt: -1 });

  const physicalProgress = Number(project.physicalProgress || 0);
  const financialProgress = Number(project.financialProgress || 0);
  const plannedProgress = Number(
    latestProgress?.plannedProgress ?? physicalProgress
  );
  const actualProgress = Number(
    latestProgress?.actualProgress ?? physicalProgress
  );
  const expenditure = Number(
    latestProgress?.expenditure ?? project.expenditure ?? 0
  );
  const approvedCost = Number(project.approvedCost || 0);
  const revisedCost = Number(project.revisedCost || approvedCost);
  const progressGap = Math.max(0, plannedProgress - actualProgress);
  const costEscalation = approvedCost > 0
    ? Math.max(0, ((revisedCost - approvedCost) / approvedCost) * 100)
    : 0;

  const mlInput = {
    physicalProgress,
    financialProgress,
    plannedProgress,
    actualProgress,
    approvedCost,
    revisedCost,
    expenditure,
    progressGap,
    costEscalation,
  };

  console.log("Sending data to ML:", mlInput);

  let predictionResponse;
  try {
    predictionResponse = await predictRisk(mlInput);
  } catch (error) {
    const serviceError = new Error(
      `ML service unavailable or prediction failed: ${error.message}`
    );
    serviceError.statusCode = 503;
    throw serviceError;
  }

  const prediction = predictionResponse.prediction || predictionResponse;
  const requiredFields = [
    "riskScore",
    "riskLevel",
    "confidence",
    "progressGap",
    "costEscalation",
  ];

  if (requiredFields.some((field) => prediction[field] === undefined)) {
    const error = new Error("ML service returned an incomplete prediction");
    error.statusCode = 502;
    throw error;
  }

  try {
    const savedPrediction = await RiskPrediction.create({
      projectId: project._id,
      riskScore: prediction.riskScore,
      riskLevel: prediction.riskLevel,
      confidence: prediction.confidence,
      progressGap: prediction.progressGap,
      costEscalation: prediction.costEscalation,
      predictionSource: "Machine Learning",
    });

    project.riskScore = prediction.riskScore;
    project.riskLevel = prediction.riskLevel;
    project.riskConfidence = prediction.confidence;
    project.riskProgressGap = prediction.progressGap;
    project.riskCostEscalation = prediction.costEscalation;
    project.riskPredictionId = savedPrediction._id;
    project.riskUpdatedAt = savedPrediction.predictionDate;

    if (["High", "Critical"].includes(prediction.riskLevel)) {
      project.status = "At Risk";
    } else if (project.status === "At Risk") {
      project.status = "On Track";
    }

    await project.save();

    return {
      project,
      prediction: savedPrediction,
      input: mlInput,
    };
  } catch (error) {
    console.error("Risk Persistence Error:", error.message);
    const persistenceError = new Error(
      `Failed to persist authoritative risk prediction: ${error.message}`
    );
    persistenceError.statusCode = 500;
    throw persistenceError;
  }
};

const getMLRiskPrediction = async (req, res) => {
  try {
    const result = await executeAuthoritativeRiskPrediction(req.params.id);

    return res.status(200).json({
      success: true,
      project: {
        id: result.project._id,
        projectCode: result.project.projectCode,
        name: result.project.name,
        riskScore: result.project.riskScore,
        riskLevel: result.project.riskLevel,
        riskConfidence: result.project.riskConfidence,
        riskProgressGap: result.project.riskProgressGap,
        riskCostEscalation: result.project.riskCostEscalation,
        riskUpdatedAt: result.project.riskUpdatedAt,
      },
      input: result.input,
      prediction: result.prediction,
    });
  } catch (error) {
    console.error("ML Risk Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "ML risk prediction failed",
      error: error.message,
    });
  }
};

module.exports = {
  getMLRiskPrediction,
  executeAuthoritativeRiskPrediction,
};