const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fromLocation: {
      type: String,
      required: true,
    },

    toLocation: {
      type: String,
      required: true,
    },

    numberOfDays: {
      type: Number,
      required: true,
    },

    budgetType: {
      type: String,
      required: true,
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