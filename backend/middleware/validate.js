const mongoose = require("mongoose");

// validate(schema) — parses req.body with a zod schema and replaces it
// with the cleaned (trimmed / coerced) data.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0].message,
    });
  }

  req.body = result.data;
  next();
};

// Rejects malformed :id params before they reach MongoDB
const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid trip id" });
  }
  next();
};

module.exports = { validate, validateObjectId };
