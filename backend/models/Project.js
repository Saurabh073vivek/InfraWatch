const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    ministry: {
      type: String,
      required: true,
      trim: true,
    },

    sector: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    implementingAgency: {
      type: String,
      trim: true,
    },

    approvedCost: {
      type: Number,
      default: 0,
    },

    revisedCost: {
      type: Number,
    },

    expenditure: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
    },

    expectedCompletion: {
      type: Date,
    },

    physicalProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    financialProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["On Track", "At Risk", "Delayed", "Completed"],
      default: "On Track",
    },

    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },

    riskConfidence: {
      type: Number,
      min: 0,
      max: 100,
    },

    riskProgressGap: {
      type: Number,
    },

    riskCostEscalation: {
      type: Number,
    },

    riskPredictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RiskPrediction",
    },

    riskUpdatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);