const express = require("express");

const {
  createTrip,
  getMyTrips,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay,
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate",
  protect,
  createTrip
);

router.get(
  "/my-trips",
  protect,
  getMyTrips
);

router.delete(
  "/:id",
  protect,
  deleteTrip
);

router.put(
  "/:id/add-activity",
  protect,
  addActivity
);

router.put(
  "/:id/remove-activity",
  protect,
  removeActivity
);

router.put(
  "/:id/regenerate-day",
  protect,
  regenerateDay
);

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const Trip = require("../models/Trip");

      const trip = await Trip.findById(
        req.params.id
      );

      res.json(trip);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;