// src/controllers/trackController.js
// ============================================================
//  CONTROLLERS
//  A controller contains the actual BUSINESS LOGIC for your API.
//  When a request hits a route, the route hands it off to a
//  controller function to do the real work (DB queries, responses, etc.)
//
//  Think of it like this:
//    Route  = the receptionist (directs your call)
//    Controller = the specialist (actually solves your problem)
// ============================================================

const Track = require('../models/Track');
const Analytics = require('../models/Analytics');

// ============================================================
//  getAllTracks
//  GET /api/tracks
//  Returns a list of all of Fola's tracks from the database.
// ============================================================
const getAllTracks = async (req, res) => {
  try {
    // Sequelize's findAll() runs: SELECT * FROM Tracks
    // We order by 'createdAt' so the newest tracks appear first
    const tracks = await Track.findAll({
      order: [['createdAt', 'DESC']],
    });

    // Send a successful JSON response with the array of tracks
    return res.status(200).json({
      success: true,
      count: tracks.length,  // Handy metadata: how many tracks were returned
      data: tracks,
    });

  } catch (error) {
    // If something goes wrong (e.g. DB is down), catch the error
    // and send a 500 Internal Server Error response
    console.error('Error in getAllTracks:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Could not retrieve tracks.',
    });
  }
};

// ============================================================
//  getTrackById
//  GET /api/tracks/:id
//  Returns a single track by its ID, including its play count.
// ============================================================
const getTrackById = async (req, res) => {
  try {
    // req.params.id gets the dynamic ':id' segment from the URL
    // e.g. GET /api/tracks/5  → req.params.id = "5"
    const { id } = req.params;

    const track = await Track.findByPk(id); // findByPk = find by Primary Key

    // If no track was found, return a 404 Not Found error
    if (!track) {
      return res.status(404).json({
        success: false,
        message: `Track with id ${id} not found.`,
      });
    }

    // Count how many times this track has been played
    const playCount = await Analytics.count({ where: { trackId: id } });

    return res.status(200).json({
      success: true,
      data: {
        ...track.toJSON(), // Spread all track fields
        playCount,         // Add the computed play count
      },
    });

  } catch (error) {
    console.error('Error in getTrackById:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Could not retrieve track.',
    });
  }
};

// ============================================================
//  createTrack
//  POST /api/tracks
//  Creates a new track in the database.
//  Expects a JSON body: { title, duration, genre, coverArtUrl }
// ============================================================
const createTrack = async (req, res) => {
  try {
    // req.body contains the data sent by the client in the request body
    const { title, duration, genre, coverArtUrl } = req.body;

    // Basic validation: make sure required fields are present
    if (!title || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title and duration for the track.',
      });
    }

    // Sequelize's create() runs: INSERT INTO Tracks (...) VALUES (...)
    const newTrack = await Track.create({ title, duration, genre, coverArtUrl });

    // Return 201 Created with the newly created track object
    return res.status(201).json({
      success: true,
      message: 'Track created successfully!',
      data: newTrack,
    });

  } catch (error) {
    // Sequelize validation errors (e.g. invalid URL, wrong ENUM value)
    // are caught here and returned as a 400 Bad Request
    console.error('Error in createTrack:', error.message);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ success: false, message: messages });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error. Could not create track.',
    });
  }
};

// ============================================================
//  logPlay
//  POST /api/tracks/:id/play
//  Logs a "play" event for a given track.
//  This is what you call when a user presses play on a song.
//  Optionally accepts: { listenerLocation } in the request body.
// ============================================================
const logPlay = async (req, res) => {
  try {
    const { id } = req.params;
    const { listenerLocation } = req.body; // Optional — e.g. "Abuja, Nigeria"

    // First, verify the track actually exists before logging a play
    const track = await Track.findByPk(id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: `Cannot log play. Track with id ${id} not found.`,
      });
    }

    // Create a new Analytics record — this IS the play log entry
    // Sequelize runs: INSERT INTO Analytics (trackId, listenerLocation, ...) VALUES (...)
    const playEvent = await Analytics.create({
      trackId: id,
      listenerLocation: listenerLocation || 'Unknown',
      // 'timestamp' defaults to NOW automatically (see Analytics model)
    });

    // Get updated total play count for this track
    const totalPlays = await Analytics.count({ where: { trackId: id } });

    return res.status(201).json({
      success: true,
      message: `Play logged for "${track.title}"!`,
      data: {
        playEvent,
        totalPlays, // Return the running total so the client can display it
      },
    });

  } catch (error) {
    console.error('Error in logPlay:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Could not log play.',
    });
  }
};

// ============================================================
//  getTrackAnalytics
//  GET /api/tracks/:id/analytics
//  Returns play history and stats for a specific track.
// ============================================================
const getTrackAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const track = await Track.findByPk(id);
    if (!track) {
      return res.status(404).json({ success: false, message: 'Track not found.' });
    }

    // Fetch all play events for this track, most recent first
    const playHistory = await Analytics.findAll({
      where: { trackId: id },
      order: [['timestamp', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: {
        track: track.title,
        totalPlays: playHistory.length,
        playHistory,
      },
    });

  } catch (error) {
    console.error('Error in getTrackAnalytics:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Could not retrieve analytics.',
    });
  }
};

// Export all controller functions so they can be used in routes
module.exports = {
  getAllTracks,
  getTrackById,
  createTrack,
  logPlay,
  getTrackAnalytics,
};