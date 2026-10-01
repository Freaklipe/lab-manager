import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { server } from '../src/app.js';
import { cleanDatabase } from './setup.js';

const createTestLab = async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/api/labs',
    payload: {
      name: 'Test Lab',
      description: 'Lab for automated tests',
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json();
};

describe('Labs API', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await server.close();
  });

  // LABS - GET
  it('GET /api/labs → should return an empty array when there are no labs', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/labs',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('GET /api/labs → should return all labs', async () => {
    await createTestLab();

    const response = await server.inject({
      method: 'GET',
      url: '/api/labs',
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({
      name: 'Test Lab',
      description: 'Lab for automated tests',
    });
  });

  it('GET /api/labs/:id → should return a lab by id', async () => {
    const lab = await createTestLab();

    const response = await server.inject({
      method: 'GET',
      url: `/api/labs/${lab.id}`,
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: lab.id,
      name: 'Test Lab',
      description: 'Lab for automated tests',
    });
  });

  it('GET /api/labs/:id → should return 404 when the lab does not exist', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/labs/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Lab not found',
    });
  });

  it('GET /api/labs/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/labs/invalid',
    });

    expect(response.statusCode).toBe(400);
  });

  // LABS - POST
  it('POST /api/labs → should create a lab', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/labs',
      payload: {
        name: 'Test Lab',
        description: 'Lab for automated tests',
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toMatchObject({
      name: 'Test Lab',
      description: 'Lab for automated tests',
    });
  });

  it('POST /api/labs → should reject a request with missing required fields', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/labs',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/labs → should reject an invalid name type', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/labs',
      payload: {
        name: {
          invalid: true,
        },
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/labs → should reject additional properties', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/labs',
      payload: {
        name: 'Test Lab',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // LABS - PATCH
  it('PATCH /api/labs/:id → should update an existing lab', async () => {
    const lab = await createTestLab();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/labs/${lab.id}`,
      payload: {
        name: 'Updated Lab',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: lab.id,
      name: 'Updated Lab',
      description: 'Lab for automated tests',
    });
  });

  it('PATCH /api/labs/:id → should update the lab description', async () => {
    const lab = await createTestLab();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/labs/${lab.id}`,
      payload: {
        description: 'Updated description',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: lab.id,
      name: 'Test Lab',
      description: 'Updated description',
    });
  });

  it('PATCH /api/labs/:id → should return 404 when the lab does not exist', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/labs/999',
      payload: {
        name: 'Updated Lab',
      },
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Lab not found',
    });
  });

  it('PATCH /api/labs/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/labs/invalid',
      payload: {
        name: 'Updated Lab',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/labs/:id → should reject an empty body', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/labs/1',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/labs/:id → should reject additional properties', async () => {
    const lab = await createTestLab();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/labs/${lab.id}`,
      payload: {
        name: 'Updated Lab',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // LABS - DELETE
  it('DELETE /api/labs/:id → should delete an existing lab', async () => {
    const lab = await createTestLab();

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/labs/${lab.id}`,
    });

    expect(response.statusCode).toBe(204);

    const getResponse = await server.inject({
      method: 'GET',
      url: `/api/labs/${lab.id}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it('DELETE /api/labs/:id → should return 404 when the lab does not exist', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/labs/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Lab not found',
    });
  });

  it('DELETE /api/labs/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/labs/invalid',
    });

    expect(response.statusCode).toBe(400);
  });
});
