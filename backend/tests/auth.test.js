// tests/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

// Express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/auth');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', authRoutes);

// Mock Models
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

// Mock JWT for middleware and controllers
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
  verify: jest.fn((token) => ({ id: '123', exp: Date.now() / 1000 + 3600 })),
  decode: jest.fn((token) => ({ id: '123', exp: Date.now() / 1000 + 3600 }))
}));

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
  await TokenBlacklist.deleteMany({});
});

describe('Auth Routes', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test1234!'
  };

  // REGISTER
  it('should register a new user', async () => {
    const res = await request(app).post('/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body).toHaveProperty('token', 'mock-token');
  });

  it('should not register user with existing email', async () => {
    await User.create(testUser);
    const res = await request(app).post('/register').send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should fail registration with weak password', async () => {
    const res = await request(app)
      .post('/register')
      .send({ ...testUser, password: 'weak' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password not strong enough');
  });

  // LOGIN
  it('should login with correct credentials', async () => {
    await User.create(testUser);

    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body).toHaveProperty('token', 'mock-token');
  });

  it('should fail login with wrong password', async () => {
    await User.create(testUser);

    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: 'WrongPass1!' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should fail login with invalid email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'invalid', password: 'Test1234!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email');
  });

  // LOGOUT
  it('should logout user with valid token', async () => {
    const res = await request(app)
      .post('/logout')
      .set('Cookie', ['accessToken=Bearer mytoken']);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });

  it('should fail logout if no token provided', async () => {
    const res = await request(app).post('/logout');

    expect(res.status).toBe(401); // matches auth middleware
    expect(res.body.msg).toBe('No token, authorization denied');
  });

  it('should fail logout if token is blacklisted', async () => {
    await TokenBlacklist.create({ token: 'mytoken', expiresAt: new Date(Date.now() + 3600 * 1000) });

    const res = await request(app)
      .post('/logout')
      .set('Cookie', ['accessToken=Bearer mytoken']);

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('Token blacklisted');
  });
});
