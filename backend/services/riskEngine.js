const Progress = require("../models/Progress");

// ==========================================
// CALCULATE PROJECT RISK
// ==========================================

const calculateRisk = async (project) => {
  let riskScore = 0;

  const factors = [];

  // ==========================================
  // 1. PROGRESS GAP
  // ==========================================

  const latestProgress = await Progress.findOne({
    projectId: project._id,
  }).sort({ createdAt: -1 });

  let progressGap = 0;

  if (latestProgress) {
    progressGap =
      Number(latestProgress.plannedProgress || 0) -
      Number(latestProgress.actualProgress || 0);

    if (progressGap >= 20) {
      riskScore += 35;

      factors.push({
        factor: "Severe Progress Delay",
        impact: "High",
        points: 35,
        message: `Project is ${progressGap}% behind the planned progress.`,
      });
    } else if (progressGap >= 10) {
      riskScore += 25;

      factors.push({
        factor: "Significant Progress Delay",
        impact: "High",
        points: 25,
        message: `Project is ${progressGap}% behind the planned progress.`,
      });
    } else if (progressGap >= 5) {
      riskScore += 15;

      factors.push({
        factor: "Progress Delay",
        impact: "Medium",
        points: 15,
        message: `Project is ${progressGap}% behind the planned progress.`,
      });
    } else if (progressGap > 0) {
      riskScore += 5;

      factors.push({
        factor: "Minor Progress Gap",
        impact: "Low",
        points: 5,
        message: `Project is ${progressGap}% behind the planned progress.`,
      });
    }
  }

  // ==========================================
  // 2. COST ESCALATION
  // ==========================================

  const approvedCost =
    Number(project.approvedCost || 0);

  const revisedCost =
    Number(project.revisedCost || 0);

  let costEscalation = 0;

  if (
    approvedCost > 0 &&
    revisedCost > approvedCost
  ) {
    costEscalation =
      ((revisedCost - approvedCost) /
        approvedCost) *
      100;

    if (costEscalation >= 30) {
      riskScore += 30;

      factors.push({
        factor: "Severe Cost Escalation",
        impact: "High",
        points: 30,
        message: `Cost has increased by ${costEscalation.toFixed(
          1
        )}% from the approved cost.`,
      });
    } else if (costEscalation >= 15) {
      riskScore += 20;

      factors.push({
        factor: "Significant Cost Escalation",
        impact: "High",
        points: 20,
        message: `Cost has increased by ${costEscalation.toFixed(
          1
        )}% from the approved cost.`,
      });
    } else if (costEscalation >= 5) {
      riskScore += 10;

      factors.push({
        factor: "Cost Escalation",
        impact: "Medium",
        points: 10,
        message: `Cost has increased by ${costEscalation.toFixed(
          1
        )}% from the approved cost.`,
      });
    }
  }

  // ==========================================
  // 3. FINANCIAL VS PHYSICAL MISMATCH
  // ==========================================

  const physicalProgress =
    Number(project.physicalProgress || 0);

  const financialProgress =
    Number(project.financialProgress || 0);

  const progressMismatch =
    financialProgress - physicalProgress;

  if (progressMismatch >= 20) {
    riskScore += 20;

    factors.push({
      factor: "Financial-Physical Mismatch",
      impact: "High",
      points: 20,
      message:
        "Financial progress is significantly higher than physical progress.",
    });
  } else if (progressMismatch >= 10) {
    riskScore += 12;

    factors.push({
      factor: "Financial-Physical Mismatch",
      impact: "Medium",
      points: 12,
      message:
        "Financial progress is higher than physical progress.",
    });
  } else if (progressMismatch >= 5) {
    riskScore += 6;

    factors.push({
      factor: "Minor Financial-Physical Gap",
      impact: "Low",
      points: 6,
      message:
        "Financial progress is slightly higher than physical progress.",
    });
  }

  // ==========================================
  // 4. PROJECT STATUS
  // ==========================================

  if (project.status === "Delayed") {
    riskScore += 15;

    factors.push({
      factor: "Project Status",
      impact: "High",
      points: 15,
      message:
        "Project is currently marked as delayed.",
    });
  } else if (project.status === "At Risk") {
    riskScore += 10;

    factors.push({
      factor: "Project Status",
      impact: "Medium",
      points: 10,
      message:
        "Project is currently marked as at risk.",
    });
  }

  // ==========================================
  // 5. LIMIT SCORE
  // ==========================================

  riskScore = Math.min(
    Math.round(riskScore),
    100
  );

  // ==========================================
  // RISK LEVEL
  // ==========================================

  let riskLevel = "Low";

  if (riskScore >= 75) {
    riskLevel = "Critical";
  } else if (riskScore >= 50) {
    riskLevel = "High";
  } else if (riskScore >= 25) {
    riskLevel = "Medium";
  }

  // ==========================================
  // SORT FACTORS
  // ==========================================

  factors.sort(
    (a, b) => b.points - a.points
  );

  return {
    riskScore,
    riskLevel,
    progressGap,
    costEscalation:
      Number(costEscalation.toFixed(2)),
    factors,
    generatedAt: new Date(),
  };
};

module.exports = {
  calculateRisk,
};