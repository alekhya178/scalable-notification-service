const db = require('../config/db');

exports.getAllTemplates = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notification_templates');
    res.json(result.rows); // Note: PG returns data in result.rows
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createTemplate = async (req, res) => {
  const { id, name, subject, body, type } = req.body;
  
  if (!id || !name || !subject || !body || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.query(
      'INSERT INTO notification_templates (id, name, subject, body, type) VALUES ($1, $2, $3, $4, $5)',
      [id, name, subject, body, type]
    );
    res.status(201).json({ message: 'Template created' });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Postgres error code for Unique Violation
      return res.status(400).json({ error: 'Template name already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
};