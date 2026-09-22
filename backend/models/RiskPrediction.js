const mongoose = require("mongoose");

const riskPredictionSchema =
  new mongoose.Schema(
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      riskLevel: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High",
          "Critical",
        ],
        required: true,
      },

      confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      progressGap: {
        type: Number,
        default: 0,
      },

      costEscalation: {
        type: Number,
        default: 0,
      },

      predictionDate: {
        type: Date,
        default: Date.now,
      },

      factors: [
        {
          factor: String,
          impact: String,
          points: Number,
          message: String,
        },
      ],

      predictionSource: {
        type: String,
        enum: [
          "Rule Engine",
          "Machine Learning",
        ],
        default: "Rule Engine",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "RiskPrediction",
  riskPredictionSchema
);