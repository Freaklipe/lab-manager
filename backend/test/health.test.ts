import { afterAll, describe, expect, it } from 'vitest';

import { server } from '../src/app.js';

describe('GET /api/health', () => {
  afterAll(async () => {
    await server.close();
  });

  it('should return API health status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ok',
    });
  });
});
