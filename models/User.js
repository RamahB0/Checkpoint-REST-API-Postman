// models/User.js
//
// Defines the Mongoose schema/model for the "User" resource that our
// REST API (GET / POST / PUT / DELETE routes in server.js) manipulates.

const mongoose = require('mongoose');

// Each user has a name, an email (unique) and an age.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
    },
  },
  {
    // Automatically add createdAt / updatedAt fields to every document.
    timestamps: true,
  }
);

// Export the compiled model so it can be required/used in server.js.
module.exports = mongoose.model('User', userSchema);
