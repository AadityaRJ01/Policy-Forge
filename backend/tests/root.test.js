const request = require('supertest');
const { app, prisma } = require('../server');

describe('Root API Test', () => {

  test('GET / should return API info', async () => {

    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toContain('Student Mental Health API');

  });

});

afterAll(async () => {
  await prisma.$disconnect();
});