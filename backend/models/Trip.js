const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fromLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    toLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },

    budgetType: {
      type: String,
      required: true,
      enum: ["Budget", "Medium", "Luxury"],
    },

    interests: {
      type: [String],
      default: [],
    },

    transportation: {
      type: String,
      default: "",
    },

    tripOverview: {
      type: Object,
      default: {},
    },

    itinerary: {
      type: Array,
      default: [],
    },

    estimatedBudget: {
      type: Object,
      default: {},
    },

    hotels: {
      type: Array,
      default: [],
    },

    foodRecommendations: {
      type: Array,
      default: [],
    },

    interestRecommendations: {
      type: Array,
      default: [],
    },

    travelTips: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);