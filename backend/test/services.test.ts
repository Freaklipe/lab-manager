import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { server } from '../src/app.js';
import { cleanDatabase } from './setup.js';

const createTestLab = async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/api/labs',
    payload: {
      name: 'Test Lab',
      description: 'Lab for service tests',
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json();
};

const createTestServer = async () => {
  const lab = await createTestLab();

  const response = await server.inject({
    method: 'POST',
    url: '/api/servers',
    payload: {
      lab_id: lab.id,
      name: 'Test Server',
      hostname: 'test-server',
      ip_address: '192.168.1.100',
      operating_system: 'Ubuntu 24.04',
      status: 'active',
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json();
};

const createTestService = async () => {
  const serverData = await createTestServer();

  const response = await server.inject({
    method: 'POST',
    url: '/api/services',
    payload: {
      server_id: serverData.id,
      name: 'Test Service',
      description: 'Service for automated tests',
      port: 8080,
      status: 'active',
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json();
};

describe('Services API', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await server.close();
  });

  // SERVICES - GET
  it('GET /api/services → should return an empty array when there are no services', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/services',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('GET /api/services → should return all services', async () => {
    await createTestService();

    const response = await server.inject({
      method: 'GET',
      url: '/api/services',
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({
      name: 'Test Service',
      description: 'Service for automated tests',
      port: 8080,
      status: 'active',
    });
  });

  it('GET /api/services/:id → should return a service by id', async () => {
    const service = await createTestService();

    const response = await server.inject({
      method: 'GET',
      url: `/api/services/${service.id}`,
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: service.id,
      server_id: service.server_id,
      name: 'Test Service',
      description: 'Service for automated tests',
      port: 8080,
      status: 'active',
    });
  });

  it('GET /api/services/:id → should return 404 when the service does not exist', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/services/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Service not found',
    });
  });

  it('GET /api/services/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/services/invalid',
    });

    expect(response.statusCode).toBe(400);
  });

  // SERVICES - POST
  it('POST /api/services → should create a service', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {
        server_id: serverData.id,
        name: 'Test Service',
        description: 'Service for automated tests',
        port: 8080,
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toMatchObject({
      server_id: serverData.id,
      name: 'Test Service',
      description: 'Service for automated tests',
      port: 8080,
      status: 'active',
    });
  });

  it('POST /api/services → should reject a request with missing required fields', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/services → should reject a service with a non-existent server', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {
        server_id: 999,
        name: 'Test Service',
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(409);
  });

  it('POST /api/services → should reject an invalid server_id type', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {
        server_id: 'invalid',
        name: 'Test Service',
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/services → should reject an invalid name type', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {
        server_id: serverData.id,
        name: {
          invalid: true,
        },
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/services → should reject an invalid port type', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {
        server_id: serverData.id,
        name: 'Test Service',
        port: {
          invalid: true,
        },
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/services → should reject an invalid port range', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {
        server_id: serverData.id,
        name: 'Test Service',
        port: 70000,
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/services → should reject additional properties', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'POST',
      url: '/api/services',
      payload: {
        server_id: serverData.id,
        name: 'Test Service',
        status: 'active',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // SERVICES - PATCH
  it('PATCH /api/services/:id → should update an existing service', async () => {
    const service = await createTestService();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/services/${service.id}`,
      payload: {
        name: 'Updated Service',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: service.id,
      server_id: service.server_id,
      name: 'Updated Service',
      description: 'Service for automated tests',
      port: 8080,
      status: 'active',
    });
  });

  it('PATCH /api/services/:id → should update service fields', async () => {
    const service = await createTestService();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/services/${service.id}`,
      payload: {
        description: 'Updated description',
        port: 9090,
        status: 'inactive',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: service.id,
      server_id: service.server_id,
      name: 'Test Service',
      description: 'Updated description',
      port: 9090,
      status: 'inactive',
    });
  });

  it('PATCH /api/services/:id → should return 404 when the service does not exist', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/services/999',
      payload: {
        name: 'Updated Service',
      },
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Service not found',
    });
  });

  it('PATCH /api/services/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/services/invalid',
      payload: {
        name: 'Updated Service',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/services/:id → should reject an empty body', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/services/1',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/services/:id → should reject additional properties', async () => {
    const service = await createTestService();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/services/${service.id}`,
      payload: {
        name: 'Updated Service',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // SERVICES - DELETE
  it('DELETE /api/services/:id → should delete an existing service', async () => {
    const service = await createTestService();

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/services/${service.id}`,
    });

    expect(response.statusCode).toBe(204);

    const getResponse = await server.inject({
      method: 'GET',
      url: `/api/services/${service.id}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it('DELETE /api/services/:id → should return 404 when the service does not exist', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/services/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Service not found',
    });
  });

  it('DELETE /api/services/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/services/invalid',
    });

    expect(response.statusCode).toBe(400);
  });
});
