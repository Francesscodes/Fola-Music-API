// src/models/Track.js
// ============================================================
//  SEQUELIZE MODEL — Track
//  A "Model" is a representation of a database TABLE in JavaScript.
//  Defining a model here tells Sequelize:
//    1. What the table should be called ('Tracks')
//    2. What columns the table should have (title, genre, etc.)
//    3. What type of data each column holds (STRING, INTEGER, etc.)
//  Sequelize will use this definition to create/sync the table in MySQL.
// ============================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Track model.
// The first argument ('Track') is the model name.
// Sequelize will automatically create a table named 'Tracks' (pluralized).
const Track = sequelize.define('Track', {

  // --- id ---
  // Sequelize automatically adds an 'id' column (auto-incrementing integer
  // primary key) to every model, so we don't need to define it manually.

  // --- title ---
  // The name of the song, e.g. "Lagos at Night"
  title: {
    type: DataTypes.STRING,  // Maps to VARCHAR(255) in MySQL
    allowNull: false,        // This field is required — cannot be empty
    validate: {
      notEmpty: true,        // Extra check: the string must not be blank
    },
  },

  // --- duration ---
  // The length of the track in seconds (e.g. 214 for 3 mins 34 secs)
  duration: {
    type: DataTypes.INTEGER, // Maps to INT in MySQL
    allowNull: false,
    validate: {
      min: 1,                // A track must be at least 1 second long
    },
  },

  // --- genre ---
  // Musical genre. We use ENUM to restrict it to specific valid values.
  genre: {
    type: DataTypes.ENUM('Alté', 'Afrobeats', 'Afro-Soul', 'R&B', 'Hip-Hop', 'Amapiano', 'Other'),
    allowNull: false,
    defaultValue: 'Alté',   // If no genre is provided, default to 'Alté'
  },

  // --- coverArtUrl ---
  // A URL string pointing to the cover art image (e.g. a Cloudinary link)
  coverArtUrl: {
    type: DataTypes.STRING,
    allowNull: true,         // This field is optional
    validate: {
      isUrl: true,           // Sequelize will check that this is a valid URL format
    },
  },

}, {
  // --- Model Options ---
  timestamps: true,          // Sequelize auto-adds 'createdAt' and 'updatedAt' columns
  tableName: 'Tracks',       // Explicitly set the table name (good practice)
});

module.exports = Track;