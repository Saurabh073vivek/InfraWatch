const Project = require("../models/Project");
const Progress = require("../models/Progress");
const { predictRisk } = require("../services/mlService");

const getMLRiskPrediction = async (req, res) => {
  try {
    const { id } = req.params;

    // Get project
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Get progress records
    const progressRecords = await Progress.find({
      projectId: id,
    }).sort({ createdAt: -1 });

    const latestProgress = progressRecords[0];

    const physicalProgress =
      Number(project.physicalProgress || 0);

    const financialProgress =
      Number(project.financialProgress || 0);

    const plannedProgress =
      Number(latestProgress?.plannedProgress || physicalProgress);

    const actualProgress =
      Number(latestProgress?.actualProgress || physicalProgress);

    const expenditure =
      Number(latestProgress?.expenditure || project.expenditure || 0);

    const approvedCost =
      Number(project.approvedCost || 0);

    const revisedCost =
      Number(project.revisedCost || approvedCost);

    // Calculate features
    const progressGap = Math.max(
      0,
      plannedProgress - actualProgress
    );

    const costEscalation =
      approvedCost > 0
        ? ((revisedCost - approvedCost) / approvedCost) * 100
        : 0;

    // Data sent to Python ML model
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

    // Call FastAPI
    const prediction = await predictRisk(mlInput);

    return res.status(200).json({
      success: true,
      project: {
        id: project._id,
        projectCode: project.projectCode,
        name: project.name,
      },
      input: mlInput,
      prediction: prediction.prediction || prediction,
    });
  } catch (error) {
    console.error("ML Risk Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "ML risk prediction failed",
      error: error.message,
    });
  }
};

module.exports = {
  getMLRiskPrediction,
};