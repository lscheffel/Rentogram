require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  database: {
    path: process.env.DATABASE_PATH || 'database.sqlite'
  }
};

module.exports = config;