const { z } = require("zod");

const name = z
  .string({ required_error: "Name is required", invalid_type_error: "Name must be text" })
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(60, "Name must be at most 60 characters");

const email = z
  .string({ required_error: "Email is required", invalid_type_error: "Email must be text" })
  .trim()
  .toLowerCase()
  .max(254, "Email is too long")
  .email("Please enter a valid email address");

// bcrypt only uses the first 72 bytes, so cap there
const newPassword = z
  .string({ required_error: "Password is required", invalid_type_error: "Password must be text" })
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const location = (label) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} must be text` })
    .trim()
    .min(2, `${label} must be at least 2 characters`)
    .max(100, `${label} must be at most 100 characters`);

const day = z.coerce
  .number({ invalid_type_error: "Day must be a number" })
  .int("Day must be a whole number")
  .min(1, "Day must be at least 1")
  .max(30, "Day must be at most 30");

const registerSchema = z.object({ name, email, password: newPassword });

const loginSchema = z.object({
  email,
  // Don't enforce strength on login — older accounts may have shorter passwords
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

const updatePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(1, "Current password is required")
    .max(128),
  newPassword,
});

const generateTripSchema = z.object({
  fromLocation: location("Starting location"),
  toLocation: location("Destination"),
  numberOfDays: z.coerce
    .number({ invalid_type_error: "Number of days must be a number" })
    .int("Number of days must be a whole number")
    .min(1, "Trip must be at least 1 day")
    .max(14, "Trip can be at most 14 days"),
  budgetType: z.enum(["Budget", "Medium", "Luxury"], {
    errorMap: () => ({ message: "Budget must be Budget, Medium or Luxury" }),
  }),
  interests: z
    .array(z.string().trim().min(1).max(40, "Each interest must be under 40 characters"))
    .max(10, "Please add at most 10 interests")
    .default([]),
  transportation: z.enum(["Flight", "Train", "Bus", "Car"], {
    errorMap: () => ({ message: "Transportation must be Flight, Train, Bus or Car" }),
  }),
});

const activitySchema = z.object({
  day,
  activity: z
    .string({ required_error: "Activity is required" })
    .trim()
    .min(1, "Activity cannot be empty")
    .max(300, "Activity must be at most 300 characters"),
});

const regenerateDaySchema = z.object({
  day,
  prompt: z
    .string({ required_error: "Please describe what you want changed" })
    .trim()
    .min(1, "Please describe what you want changed")
    .max(300, "Request must be at most 300 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  generateTripSchema,
  activitySchema,
  regenerateDaySchema,
};
