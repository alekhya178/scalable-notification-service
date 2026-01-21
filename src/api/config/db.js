const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'user123',
  database: process.env.DB_NAME || 'notifications_db',
  port: 5432,
});

module.exports = pool;