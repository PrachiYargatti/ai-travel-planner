const Trip = require("../models/Trip");
const {
  generateTripPlan,
  regenerateDayPlan,
} = require("../services/geminiService");

const createTrip = async (req, res) => {
  try {
    const {
      fromLocation,
      toLocation,
      numberOfDays,
      budgetType,
      interests,
      transportation,
    } = req.body;

    const aiResponse = await generateTripPlan(
      fromLocation,
      toLocation,
      numberOfDays,
      budgetType,
      interests,
      transportation
    );

    const parsedData = JSON.parse(
      aiResponse.replace(/```json|```/g, "")
    );

    const trip = await Trip.create({
      userId: req.user.id,
      fromLocation,
      toLocation,
      numberOfDays,
      budgetType,
      interests,
      transportation,
      itinerary: parsedData.itinerary,
      estimatedBudget:
        parsedData.estimatedBudget,
      hotels: parsedData.hotels,
      interestRecommendations:
        parsedData.interestRecommendations,
      tripOverview: parsedData.tripOverview,
      foodRecommendations:
        parsedData.foodRecommendations,
      travelTips:
        parsedData.travelTips,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addActivity = async (req, res) => {
  try {
    const { day, activity } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const dayPlan = trip.itinerary.find(
      (item) => item.day === day
    );

    if (!dayPlan) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    dayPlan.activities.push(activity);

    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeActivity = async (req, res) => {
  try {
    const { day, activity } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const dayPlan = trip.itinerary.find(
      (item) => item.day === day
    );

    if (!dayPlan) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    dayPlan.activities =
      dayPlan.activities.filter(
        (item) => item !== activity
      );

    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const regenerateDay = async (req, res) => {
  try {
    const { day, prompt } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const aiResponse = await regenerateDayPlan(
      trip.fromLocation,
      trip.toLocation,
      day,
      trip.interests,
      prompt
    );

    const newDay = JSON.parse(
      aiResponse.replace(/```json|```/g, "")
    );

    if (
      newDay.activities &&
      typeof newDay.activities[0] === "object"
    ) {
      newDay.activities = newDay.activities.map(
        (item) => item.description || JSON.stringify(item)
      );
    }

    const index = trip.itinerary.findIndex(
      (item) => item.day === day
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    trip.itinerary[index] = newDay;

    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTrip,
  getMyTrips,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay,
};