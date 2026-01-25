const db = require('../config/db');

exports.getAllTemplates = async (req, res) => {
  try {
    // MySQL returns [rows, fields], so we destructure the first item
    const [rows] = await db.query('SELECT * FROM notification_templates');
    res.json(rows);
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
    // UPDATED: Used '?' placeholders for MySQL
    await db.query(
      'INSERT INTO notification_templates (id, name, subject, body, type) VALUES (?, ?, ?, ?, ?)',
      [id, name, subject, body, type]
    );
    res.status(201).json({ message: 'Template created' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') { // MySQL specific error code
      return res.status(400).json({ error: 'Template name already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
};