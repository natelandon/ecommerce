import request from 'supertest';
import { createServer } from './server';

describe('API integration', () => {
  it('responds with health', async () => {
    const app = createServer();
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
