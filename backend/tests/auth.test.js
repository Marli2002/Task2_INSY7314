// tests/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock your Express app
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/auth');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', authRoutes);

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'), // always returns 'mock-token'
  decode: jest.fn((token) => ({ id: '123', exp: Date.now() / 1000 + 3600 }))
}));

// Models
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test1234!'
  };

  it('should register a new user', async () => {
    const res = await request(app).post('/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body).toHaveProperty('token', 'mock-token');
  });

  it('should login with correct credentials', async () => {
    // Create user first
    await User.create(testUser);

    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body).toHaveProperty('token', 'mock-token');
  });

  it('should fail login with wrong password', async () => {
    await User.create(testUser);

    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: 'WrongPass1!' });

    expect(res.statusCode).toBe(401);
  });
});
