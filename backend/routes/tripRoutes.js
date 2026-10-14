const express = require("express");

const {
  createTrip,
  getMyTrips,
  getTripById,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay,
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");
const { validate, validateObjectId } = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const {
  generateTripSchema,
  activitySchema,
  regenerateDaySchema,
} = require("../validators/schemas");

const router = express.Router();

// Every trip route requires login
router.use(protect);

router.post("/generate", aiLimiter, validate(generateTripSchema), createTrip);

router.get("/my-trips", getMyTrips);

router.get("/:id", validateObjectId, getTripById);
router.delete("/:id", validateObjectId, deleteTrip);

router.put(
  "/:id/add-activity",
  validateObjectId,
  validate(activitySchema),
  addActivity
);

router.put(
  "/:id/remove-activity",
  validateObjectId,
  validate(activitySchema),
  removeActivity
);

router.put(
  "/:id/regenerate-day",
  validateObjectId,
  aiLimiter,
  validate(regenerateDaySchema),
  regenerateDay
);

module.exports = router;
