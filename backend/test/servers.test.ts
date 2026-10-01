import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { server } from '../src/app.js';
import { cleanDatabase } from './setup.js';

const createTestLab = async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/api/labs',
    payload: {
      name: 'Test Lab',
      description: 'Lab for server tests',
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

describe('Servers API', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await server.close();
  });

  // SERVERS - GET
  it('GET /api/servers → should return an empty array when there are no servers', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/servers',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('GET /api/servers → should return all servers', async () => {
    await createTestServer();

    const response = await server.inject({
      method: 'GET',
      url: '/api/servers',
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({
      name: 'Test Server',
      hostname: 'test-server',
      ip_address: '192.168.1.100',
      operating_system: 'Ubuntu 24.04',
      status: 'active',
    });
  });

  it('GET /api/servers/:id → should return a server by id', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'GET',
      url: `/api/servers/${serverData.id}`,
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: serverData.id,
      lab_id: serverData.lab_id,
      name: 'Test Server',
      hostname: 'test-server',
      ip_address: '192.168.1.100',
      operating_system: 'Ubuntu 24.04',
      status: 'active',
    });
  });

  it('GET /api/servers/:id → should return 404 when the server does not exist', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/servers/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Server not found',
    });
  });

  it('GET /api/servers/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/servers/invalid',
    });

    expect(response.statusCode).toBe(400);
  });

  // SERVERS - POST
  it('POST /api/servers → should create a server', async () => {
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

    expect(response.json()).toMatchObject({
      lab_id: lab.id,
      name: 'Test Server',
      hostname: 'test-server',
      ip_address: '192.168.1.100',
      operating_system: 'Ubuntu 24.04',
      status: 'active',
    });
  });

  it('POST /api/servers → should reject a request with missing required fields', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/servers',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/servers → should reject a server with a non-existent lab', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/servers',
      payload: {
        lab_id: 999,
        name: 'Test Server',
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(409);
  });

  it('POST /api/servers → should reject an invalid lab_id type', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/servers',
      payload: {
        lab_id: 'invalid',
        name: 'Test Server',
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/servers → should reject an invalid name type', async () => {
    const lab = await createTestLab();

    const response = await server.inject({
      method: 'POST',
      url: '/api/servers',
      payload: {
        lab_id: lab.id,
        name: {
          invalid: true,
        },
        status: 'active',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/servers → should reject additional properties', async () => {
    const lab = await createTestLab();

    const response = await server.inject({
      method: 'POST',
      url: '/api/servers',
      payload: {
        lab_id: lab.id,
        name: 'Test Server',
        status: 'active',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // SERVERS - PATCH
  it('PATCH /api/servers/:id → should update an existing server', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/servers/${serverData.id}`,
      payload: {
        name: 'Updated Server',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: serverData.id,
      lab_id: serverData.lab_id,
      name: 'Updated Server',
      hostname: 'test-server',
      ip_address: '192.168.1.100',
      operating_system: 'Ubuntu 24.04',
      status: 'active',
    });
  });

  it('PATCH /api/servers/:id → should update server fields', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/servers/${serverData.id}`,
      payload: {
        hostname: 'updated-server',
        ip_address: '192.168.1.200',
        operating_system: 'Debian 13',
        status: 'inactive',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: serverData.id,
      name: 'Test Server',
      hostname: 'updated-server',
      ip_address: '192.168.1.200',
      operating_system: 'Debian 13',
      status: 'inactive',
    });
  });

  it('PATCH /api/servers/:id → should return 404 when the server does not exist', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/servers/999',
      payload: {
        name: 'Updated Server',
      },
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Server not found',
    });
  });

  it('PATCH /api/servers/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/servers/invalid',
      payload: {
        name: 'Updated Server',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/servers/:id → should reject an empty body', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/servers/1',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/servers/:id → should reject additional properties', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/servers/${serverData.id}`,
      payload: {
        name: 'Updated Server',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // SERVERS - DELETE
  it('DELETE /api/servers/:id → should delete an existing server', async () => {
    const serverData = await createTestServer();

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/servers/${serverData.id}`,
    });

    expect(response.statusCode).toBe(204);

    const getResponse = await server.inject({
      method: 'GET',
      url: `/api/servers/${serverData.id}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it('DELETE /api/servers/:id → should return 404 when the server does not exist', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/servers/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Server not found',
    });
  });

  it('DELETE /api/servers/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/servers/invalid',
    });

    expect(response.statusCode).toBe(400);
  });
});
