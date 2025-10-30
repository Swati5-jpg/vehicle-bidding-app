const request = require('supertest');
const app = require('../server.js'); // your Express app

describe('🚗 Vehicle API basic tests', () => {
  test('GET /api/vehicles should respond with 200', async () => {
    const response = await request(app).get('/api/vehicles');
    expect(response.statusCode).toBe(200);
  });
});
