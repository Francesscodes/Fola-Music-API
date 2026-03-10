// src/routes/trackRoutes.js
// ============================================================
//  ROUTES
//  Routes are the "address book" of your API.
//  They map a specific HTTP METHOD + URL PATH to a controller function.
//
//  FORMAT:  router.METHOD('path', controllerFunction)
//
//  HTTP Methods recap:
//    GET    → Read / retrieve data (safe, no side effects)
//    POST   → Create new data
//    PUT    → Update existing data (replace the whole resource)
//    PATCH  → Update existing data (update only specific fields)
//    DELETE → Delete data
// ============================================================

const express = require('express');

// express.Router() creates a mini-app that handles a subset of routes.
// We'll mount this router under '/api/tracks' in app.js, so all paths
// defined here are RELATIVE to '/api/tracks'.
const router = express.Router();

// Import the controller functions (the actual logic lives there)
const {
  getAllTracks,
  getTrackById,
  createTrack,
  logPlay,
  getTrackAnalytics,
} = require('../controllers/trackController');

// ============================================================
//  ROUTE DEFINITIONS
//
//  Base path (set in app.js): /api/tracks
// ============================================================

// GET  /api/tracks
// → Returns all of Fola's tracks
router.get('/', getAllTracks);

// POST /api/tracks
// → Creates a new track
// Body: { "title": "...", "duration": 200, "genre": "Alté", "coverArtUrl": "..." }
router.post('/', createTrack);

// GET  /api/tracks/:id
// → Returns a single track by ID (e.g. GET /api/tracks/3)
// ':id' is a URL parameter — it's dynamic and can be any value
router.get('/:id', getTrackById);

// POST /api/tracks/:id/play
// → Logs a play event for the track with the given ID
// Body (optional): { "listenerLocation": "Lagos, Nigeria" }
router.post('/:id/play', logPlay);

// GET  /api/tracks/:id/analytics
// → Returns play count and history for a specific track
router.get('/:id/analytics', getTrackAnalytics);

// Export the router so app.js can mount it
module.exports = router;