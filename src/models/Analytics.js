// src/models/Analytics.js
// ============================================================
//  SEQUELIZE MODEL — Analytics
//  This model tracks every time a song is played.
//  Each row in the 'Analytics' table = one play event.
//  It is linked to the Track model via a "Foreign Key" (trackId).
//
//  RELATIONSHIP:
//    - One Track can have MANY Analytics records (One-to-Many)
//    - Each Analytics record belongs to ONE Track
// ============================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Track = require('./Track');

const Analytics = sequelize.define('Analytics', {

  // --- trackId ---
  // A Foreign Key that links this play event to a specific track.
  // It stores the 'id' of the track that was played.
  trackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Track,   // This references the 'Tracks' table
      key: 'id',      // Specifically, the 'id' column in that table
    },
  },

  // --- timestamp ---
  // The exact date and time the track was played.
  // We default to "right now" (DATE.NOW) when a new record is created.
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Automatically set to the current time
  },

  // --- listenerLocation ---
  // Where the listener is located, e.g. "Lagos, Nigeria" or "London, UK".
  // This is optional — we won't always know the listener's location.
  listenerLocation: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Unknown',
  },

}, {
  timestamps: true,
  tableName: 'Analytics',
});

// ============================================================
//  ASSOCIATIONS (Relationships between models)
//  This tells Sequelize about the One-to-Many relationship.
//  - A Track "has many" Analytics records
//  - Each Analytics record "belongs to" one Track
//  The 'onDelete: CASCADE' means if a Track is deleted,
//  all its associated Analytics records are also deleted automatically.
// ============================================================
Track.hasMany(Analytics, { foreignKey: 'trackId', onDelete: 'CASCADE' });
Analytics.belongsTo(Track, { foreignKey: 'trackId' });

module.exports = Analytics;