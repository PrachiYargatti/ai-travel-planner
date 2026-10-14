const express = require("express");

const {
  registerUser,
  loginUser,
  updatePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");
const {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
} = require("../validators/schemas");

const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), registerUser);
router.post("/login", loginLimiter, validate(loginSchema), loginUser);
router.put(
  "/update-password",
  protect,
  validate(updatePasswordSchema),
  updatePassword
);

module.exports = router;
