// server.js
//
// Entry point of the REST API checkpoint.
// - Loads environment variables from config/.env
// - Connects to MongoDB (locally or via MongoDB Atlas) using Mongoose
// - Exposes four routes on the "User" resource:
//     GET    /users      -> return all users
//     POST   /users      -> add a new user to the database
//     PUT    /users/:id  -> edit a user by id
//     DELETE /users/:id  -> remove a user by id

// Load environment variables from config/.env (see config/.env.example).
require('dotenv').config({ path: './config/.env' });

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

// Parse incoming JSON request bodies (needed for POST / PUT).
app.use(express.json());

// ---------------------------------------------------------------------
// Database connection
// ---------------------------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ---------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------

// GET /users -> return all users
app.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(users);
  });
});

// POST /users -> add a new user to the database
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;

  User.create({ name, email, age }, (err, newUser) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json(newUser);
  });
});

// PUT /users/:id -> edit a user by id
app.put('/users/:id', (req, res) => {
  const { id } = req.params;

  User.findByIdAndUpdate(id, req.body, { new: true }, (err, updatedUser) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  });
});

// DELETE /users/:id -> remove a user by id
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id, (err, deletedUser) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(deletedUser);
  });
});

// ---------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
