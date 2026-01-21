const request = require('supertest');
const express = require('express');
const templateRoutes = require('../src/api/routes/templateRoutes');
const notificationRoutes = require('../src/api/routes/notificationRoutes');

// Mock the dependencies so we don't need real DB or RabbitMQ for unit tests
jest.mock('../src/api/config/db', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] })
}));

jest.mock('../src/api/services/rabbitmqService', () => ({
  publishToQueue: jest.fn().mockResolvedValue(true)
}));

const app = express();
app.use(express.json());
app.use('/api', templateRoutes);
app.use('/api', notificationRoutes);

describe('Notification API', () => {
  
  it('GET /api/templates should return 200', async () => {
    const res = await request(app).get('/api/templates');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/notifications should return 202 Accepted', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .send({
        recipient: "test@test.com",
        type: "EMAIL",
        templateId: "1",
        params: { name: "Test" }
      });
    
    expect(res.statusCode).toEqual(202);
    expect(res.body.message).toEqual('Notification queued successfully');
  });

  it('POST /api/notifications should fail with 400 if missing fields', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .send({
        recipient: "test@test.com"
        // Missing type and templateId
      });
    
    expect(res.statusCode).toEqual(400);
  });
});