const { publishToQueue } = require('../services/rabbitmqService');

exports.sendNotification = async (req, res) => {
  const { recipient, type, templateId, params } = req.body;

  // Basic Validation
  if (!recipient || !type || !templateId) {
    return res.status(400).json({ error: 'Missing required fields: recipient, type, or templateId' });
  }

  const payload = { recipient, type, templateId, params };

  // Send to Queue
  const success = await publishToQueue(payload);

  if (success) {
    // 202 Accepted = "We received it and will process it later"
    res.status(202).json({ message: 'Notification queued successfully' });
  } else {
    res.status(500).json({ error: 'Failed to queue notification' });
  }
};