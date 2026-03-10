Fola Music API 
A lightweight Node.js API built with Express and Sequelize to manage music tracks, log play events, and track listener analytics. This project serves as the backend for a music streaming or management platform.

Features
Track Management: Create and retrieve music tracks with metadata (title, genre, duration).

Analytics: Log play events including listener location data.

Data Persistence: Uses Sequelize ORM to interact with a database.

Environment Configuration: Securely manages credentials via .env.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

ORM: Sequelize

Database: (MySQL)

Environment: dotenv

Project Structure
src/
├── config/
│   └── database.js      # Sequelize connection setup
├── controllers/
│   └── trackController.js # Business logic for tracks
├── models/
│   ├── Track.js         # Track data model
│   └── Analytics.js     # Analytics data model
├── routes/
│   └── TrackRoutes.js   # API route definitions
└── app.js               # Entry point & Express app setup

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/fola-music-api.git
cd fola-music-api
Install dependencies:

Bash
npm install
Set up Environment Variables:
Create a .env file in the root directory and add your credentials:

Code snippet
PORT=3000
DB_NAME=fola_music_db
DB_USER=your_user
DB_PASSWORD=your_password
# Add other necessary variables from your .env file
Run the application:

Bash
npm start

API  Endpoints
Method     Endpoint         Description
GET      /api/tracks       Retrieve all tracks
POST     /api/tracks         Create a new track
GET    /api/tracks/:id     Get details of a single track

Analytics
Method     Endpoint,               Description
POST    /api/tracks/:id/play     Log a play event for a track
GET    /api/tracks/:id/analytics  Get play count and location history

Testing with Postman/Postcode
To create a track, send a POST request to http://localhost:3000/api/tracks with the following JSON body:

JSON
{
  "title": "Lagos at Night",
  "duration": 214,
  "genre": "Alté"
}



