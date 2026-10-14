const Trip = require("../models/Trip");
const {
  generateTripPlan,
  regenerateDayPlan,
} = require("../services/geminiService");

// Turns AI / server failures into a safe response
const handleError = (res, error, fallbackMessage) => {
  if (error.statusCode === 502) {
    return res
      .status(502)
      .json({ message: "The AI returned an unexpected response. Please try again." });
  }

  console.error(fallbackMessage, error);
  res.status(500).json({ message: fallbackMessage });
};

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

    const plan = await generateTripPlan({
      fromLocation,
      toLocation,
      numberOfDays,
      budgetType,
      interests,
      transportation,
    });

    const trip = await Trip.create({
      userId: req.user.id,
      fromLocation,
      toLocation,
      numberOfDays,
      budgetType,
      interests,
      transportation,
      ...plan,
    });

    res.status(201).json(trip);
  } catch (error) {
    handleError(res, error, "Failed to generate trip. Please try again.");
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(trips);
  } catch (error) {
    handleError(res, error, "Failed to load trips.");
  }
};

// FIX: only the owner can read a trip (was: findById with no user check)
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    handleError(res, error, "Failed to load trip.");
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete trip.");
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
      return res.status(404).json({ message: "Trip not found" });
    }

    const dayPlan = trip.itinerary.find((item) => item.day === day);

    if (!dayPlan) {
      return res.status(404).json({ message: "Day not found" });
    }

    dayPlan.activities.push(activity);

    // itinerary is a Mixed array, so Mongoose can't see nested changes by itself
    trip.markModified("itinerary");
    await trip.save();

    res.json(trip);
  } catch (error) {
    handleError(res, error, "Failed to add activity.");
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
      return res.status(404).json({ message: "Trip not found" });
    }

    const dayPlan = trip.itinerary.find((item) => item.day === day);

    if (!dayPlan) {
      return res.status(404).json({ message: "Day not found" });
    }

    dayPlan.activities = dayPlan.activities.filter((item) => item !== activity);

    trip.markModified("itinerary");
    await trip.save();

    res.json(trip);
  } catch (error) {
    handleError(res, error, "Failed to remove activity.");
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
      return res.status(404).json({ message: "Trip not found" });
    }

    const index = trip.itinerary.findIndex((item) => item.day === day);

    if (index === -1) {
      return res.status(404).json({ message: "Day not found" });
    }

    const newDay = await regenerateDayPlan({
      fromLocation: trip.fromLocation,
      toLocation: trip.toLocation,
      day,
      interests: trip.interests,
      customPrompt: prompt,
    });

    trip.itinerary[index] = newDay;

    trip.markModified("itinerary");
    await trip.save();

    res.json(trip);
  } catch (error) {
    handleError(res, error, "Failed to regenerate day. Please try again.");
  }
};

module.exports = {
  createTrip,
  getMyTrips,
  getTripById,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay,
};
