const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    month: {
      type: String,
      required: true,
      trim: true,
    },

    plannedProgress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    actualProgress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    expenditure: {
      type: Number,
      default: 0,
      min: 0,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Progress",
  progressSchema
);