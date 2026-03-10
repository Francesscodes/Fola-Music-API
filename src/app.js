// src/app.js
// ============================================================
//  MAIN APPLICATION ENTRY POINT
//  This file is the heart of the API. It:
//    1. Loads environment variables
//    2. Creates the Express app
//    3. Registers middleware
//    4. Mounts routes
//    5. Connects to the database
//    6. Starts the HTTP server
// ============================================================

// Step 1: Load .env variables FIRST — before anything else
// This makes process.env.DB_NAME, process.env.JWT_SECRET, etc. available
require('dotenv').config();

const express = require('express');
const sequelize = require('./config/database');

// Import models — this ensures Sequelize is aware of them
// and their associations (relationships) are registered before sync
require('./models/Track');
require('./models/Analytics');

// Import route definitions
const trackRoutes = require('./routes/trackRoutes');

// ============================================================
//  CREATE THE EXPRESS APP
// ============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
//  MIDDLEWARE
//  Middleware are functions that run on EVERY incoming request
//  BEFORE it reaches your route handler. They can:
//    - Parse the request body (so you can read req.body)
//    - Log requests
//    - Authenticate users
//    - Handle errors
//  Order matters! Middleware is executed top-to-bottom.
// ============================================================

// express.json() parses incoming requests with a JSON body.
// Without this, req.body would be undefined when you POST data.
// Example: POST /api/tracks with body {"title":"Eleyele"} → req.body.title = "Eleyele"
app.use(express.json());

// express.urlencoded() parses URL-encoded form data (HTML form submissions)
// 'extended: true' allows for nested objects in the form data
app.use(express.urlencoded({ extended: true }));

// ============================================================
//  SIMPLE REQUEST LOGGER MIDDLEWARE
//  This custom middleware logs every incoming request to the console.
//  Great for debugging during development.
//  'next()' hands control to the next middleware or route handler.
// ============================================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // IMPORTANT: always call next() or the request will hang
});

// ============================================================
//  MOUNT ROUTES
//  app.use(basePath, router) attaches our route definitions.
//  All routes in trackRoutes.js will be prefixed with '/api/tracks'.
//  e.g. router.get('/') in trackRoutes.js becomes GET /api/tracks
//       router.post('/:id/play')       becomes POST /api/tracks/:id/play
// ============================================================
app.use('/api/tracks', trackRoutes);

// ============================================================
//  ROOT / HEALTH CHECK ROUTE
//  A simple route to confirm the API is running.
//  Access it at: GET http://localhost:3000/
// ============================================================
app.get('/', (req, res) => {
  res.status(200).json({
    message: "🎵 Welcome to Fola's Music API! The server is live.",
    version: '1.0.0',
    endpoints: {
      getAllTracks:      'GET  /api/tracks',
      getTrackById:     'GET  /api/tracks/:id',
      createTrack:      'POST /api/tracks',
      logPlay:          'POST /api/tracks/:id/play',
      getTrackAnalytics:'GET  /api/tracks/:id/analytics',
    },
  });
});

// ============================================================
//  404 HANDLER
//  If no route above matched, this middleware catches the request
//  and returns a friendly 404. Always place this AFTER all routes.
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================================
//  GLOBAL ERROR HANDLER
//  Express recognises error-handling middleware by its 4 parameters:
//  (err, req, res, next). This catches any error passed via next(err).
//  Always place this LAST.
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  });
});

// ============================================================
//  DATABASE SYNC + SERVER START
//  sequelize.sync() checks if the tables defined in your models
//  exist in MySQL. If they don't, it creates them automatically.
//
//  { alter: true } — safe for development: updates existing tables
//                    to match your model if you add new columns.
//  { force: true } — DANGER: drops and recreates tables every restart.
//                    Only use when you want a clean slate.
// ============================================================
const startServer = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log('✅ All models synced with the database.');

    // Start listening for HTTP requests
    app.listen(PORT, () => {
      console.log(`\n🚀 Fola's Music API is running at http://localhost:${PORT}`);
      console.log(`📖 Health check: http://localhost:${PORT}/\n`);
    });

  } catch (error) {
    console.error('❌ Unable to start the server:', error.message);
    // Exit the process if we can't connect to the DB — no point running
    process.exit(1);
  }
};

startServer();