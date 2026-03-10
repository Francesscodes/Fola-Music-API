// src/config/database.js
// ============================================================
//  DATABASE CONNECTION SETUP
//  Sequelize is an ORM (Object-Relational Mapper). Instead of
//  writing raw SQL like "SELECT * FROM tracks", Sequelize lets
//  you work with JavaScript objects and methods instead.
//  Think of it as a translator between your JS code and MySQL.
// ============================================================

// Load environment variables from the .env file into process.env
require('dotenv').config();

// Import the Sequelize class from the sequelize package
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance — this is our database connection.
// We pass in the DB name, username, and password from our .env file
// so we never hardcode sensitive credentials in our source code.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,

    // Tell Sequelize we are using MySQL
    dialect: 'mysql',

    // Logging: By default, Sequelize prints every SQL query to the console.
    // This is helpful during development. Set to false to silence it in production.
    logging: console.log,
  }
);

// Export the connection so other files (like models) can use it
module.exports = sequelize;