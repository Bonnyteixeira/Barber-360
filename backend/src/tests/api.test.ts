import request from 'supertest';
import express from 'express';
import apiRouter from '../routes.js';
import { errorHandler } from '../shared/middlewares/errorHandler.js';

// Setup Mock active Express app for testing isolated route responses
const app = express();
app.use(express.json());
app.use('/api/v1', apiRouter);
app.get('/', (req, res) => {
  res.json({ name: 'Barber 360 Enterprise API Platform', status: 'online' });
});
app.use(errorHandler);

describe('Barber 360 Enterprise Backend - Core Integration & Security Tests', () => {
  
  // 1. Health router test
  it('should respond with online status and app name at root level', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Barber 360 Enterprise API Platform');
    expect(res.body).toHaveProperty('status', 'online');
  });

  // 2. JWT auth gate tests
  it('should block accesses to protected barbers list if Authorization Bearer header is missing', async () => {
    const res = await request(app).get('/api/v1/barbers');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Authorization Bearer');
  });

  // 3. Invalid credentials test
  it('should reject login attempt if username or password properties are empty', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });
});
