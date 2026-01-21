const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.MQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('notifications', { durable: true });
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
    // Retry connection after 5 seconds if it fails
    setTimeout(connectRabbitMQ, 5000);
  }
};

const publishToQueue = async (data) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  try {
    channel.sendToQueue('notifications', Buffer.from(JSON.stringify(data)), {
      persistent: true
    });
    console.log('Message sent to queue:', data);
    return true;
  } catch (error) {
    console.error('Error publishing message:', error);
    return false;
  }
};

// Start connection immediately
connectRabbitMQ();

module.exports = { publishToQueue };