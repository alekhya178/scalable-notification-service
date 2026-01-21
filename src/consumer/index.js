const amqp = require('amqplib');
const mysql = require('mysql2/promise');

// 1. Setup Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'notifications_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Helper to replace placeholders (e.g., "Hi {name}" -> "Hi John")
const renderTemplate = (template, params) => {
  let subject = template.subject;
  let body = template.body;
  Object.keys(params).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    subject = subject.replace(regex, params[key]);
    body = body.replace(regex, params[key]);
  });
  return { subject, body };
};

// 3. Main Consumer Logic
const startConsumer = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.MQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'notifications';

    await channel.assertQueue(queue, { durable: true });
    
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('Received Task:', content);

        try {
          // Fetch Template from DB (MySQL uses ? for placeholders)
          const [rows] = await pool.query('SELECT * FROM notification_templates WHERE id = ?', [content.templateId]);
          
          if (rows.length === 0) {
            console.error(`Template ID ${content.templateId} not found`);
            channel.ack(msg); // Ack anyway so we don't loop forever
            return;
          }

          const template = rows[0];
          
          // Render the final message
          const { subject, body } = renderTemplate(template, content.params);

          // SIMULATE SENDING (Log to console)
          console.log('---------------------------------------------------');
          console.log(`SENDING ${content.type} TO: ${content.recipient}`);
          console.log(`SUBJECT: ${subject}`);
          console.log(`BODY:    ${body}`);
          console.log('---------------------------------------------------');

          // Acknowledge (Tell RabbitMQ we are done)
          channel.ack(msg);
        } catch (err) {
          console.error('Error processing message:', err);
          // Optional: channel.nack(msg) if you want to retry
        }
      }
    });
  } catch (error) {
    console.error('Consumer Error:', error);
    setTimeout(startConsumer, 5000); // Retry connection
  }
};

startConsumer();