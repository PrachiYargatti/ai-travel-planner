const rateLimit = require("express-rate-limit");

const make = (options) =>
  rateLimit({
    standardHeaders: "draft-7",
    legacyHeaders: false,
    ...options,
  });

// Every request, per IP
const globalLimiter = make({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: "Too many requests. Please try again later." },
});

// Login: only failed attempts count
const loginLimiter = make({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
});

// Register: stop mass account creation
const registerLimiter = make({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many accounts created. Try again later." },
});

// Gemini calls (generate + regenerate day) — per logged-in user.
// Must be used AFTER the `protect` middleware.
const aiLimiter = make({
  windowMs: 60 * 60 * 1000,
  max: 15,
  keyGenerator: (req) => `user:${req.user.id}`,
  message: {
    message: "AI request limit reached (15 per hour). Please try again later.",
  },
});

module.exports = { globalLimiter, loginLimiter, registerLimiter, aiLimiter };
