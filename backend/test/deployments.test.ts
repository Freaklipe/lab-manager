import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { server } from '../src/app.js';
import { cleanDatabase } from './setup.js';

const createTestLab = async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/api/labs',
    payload: {
      name: 'Test Lab',
      description: 'Lab for deployment tests',
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json();
};

const createTestProject = async () => {
  const lab = await createTestLab();

  const response = await server.inject({
    method: 'POST',
    url: '/api/projects',
    payload: {
      lab_id: lab.id,
      name: 'Test Project',
      description: 'Project for deployment tests',
      repository_url: 'https://github.com/test/project',
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json();
};

const createTestDeployment = async () => {
  const project = await createTestProject();

  const response = await server.inject({
    method: 'POST',
    url: '/api/deployments',
    payload: {
      project_id: project.id,
      version: 'v1.0.0',
      environment: 'production',
      status: 'success',
      deployed_at: '2026-09-30T12:00:00.000Z',
    },
  });

  expect(response.statusCode).toBe(201);

  return response.json();
};

describe('Deployments API', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await server.close();
  });

  // DEPLOYMENTS - GET
  it('GET /api/deployments → should return an empty array when there are no deployments', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/deployments',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('GET /api/deployments → should return all deployments', async () => {
    await createTestDeployment();

    const response = await server.inject({
      method: 'GET',
      url: '/api/deployments',
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({
      version: 'v1.0.0',
      environment: 'production',
      status: 'success',
    });
  });

  it('GET /api/deployments/:id → should return a deployment by id', async () => {
    const deployment = await createTestDeployment();

    const response = await server.inject({
      method: 'GET',
      url: `/api/deployments/${deployment.id}`,
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: deployment.id,
      project_id: deployment.project_id,
      version: 'v1.0.0',
      environment: 'production',
      status: 'success',
    });
  });

  it('GET /api/deployments/:id → should return 404 when the deployment does not exist', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/deployments/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Deployment not found',
    });
  });

  it('GET /api/deployments/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/deployments/invalid',
    });

    expect(response.statusCode).toBe(400);
  });

  // DEPLOYMENTS - POST
  it('POST /api/deployments → should create a deployment', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {
        project_id: project.id,
        version: 'v1.0.0',
        environment: 'production',
        status: 'success',
        deployed_at: '2026-09-30T12:00:00.000Z',
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toMatchObject({
      project_id: project.id,
      version: 'v1.0.0',
      environment: 'production',
      status: 'success',
    });
  });

  it('POST /api/deployments → should create a deployment without deployed_at', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {
        project_id: project.id,
        version: 'v1.0.0',
        environment: 'staging',
        status: 'pending',
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toMatchObject({
      project_id: project.id,
      version: 'v1.0.0',
      environment: 'staging',
      status: 'pending',
      deployed_at: null,
    });
  });

  it('POST /api/deployments → should reject a request with missing required fields', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/deployments → should reject a deployment with a non-existent project', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {
        project_id: 999,
        version: 'v1.0.0',
        environment: 'production',
        status: 'success',
      },
    });

    expect(response.statusCode).toBe(409);
  });

  it('POST /api/deployments → should reject an invalid project_id type', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {
        project_id: 'invalid',
        version: 'v1.0.0',
        environment: 'production',
        status: 'success',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/deployments → should reject an invalid version type', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {
        project_id: project.id,
        version: {
          invalid: true,
        },
        environment: 'production',
        status: 'success',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/deployments → should reject an invalid deployed_at format', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {
        project_id: project.id,
        version: 'v1.0.0',
        environment: 'production',
        status: 'success',
        deployed_at: 'not-a-date',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/deployments → should reject additional properties', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'POST',
      url: '/api/deployments',
      payload: {
        project_id: project.id,
        version: 'v1.0.0',
        environment: 'production',
        status: 'success',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // DEPLOYMENTS - PATCH
  it('PATCH /api/deployments/:id → should update an existing deployment', async () => {
    const deployment = await createTestDeployment();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/deployments/${deployment.id}`,
      payload: {
        version: 'v1.1.0',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: deployment.id,
      project_id: deployment.project_id,
      version: 'v1.1.0',
      environment: 'production',
      status: 'success',
    });
  });

  it('PATCH /api/deployments/:id → should update deployment fields', async () => {
    const deployment = await createTestDeployment();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/deployments/${deployment.id}`,
      payload: {
        environment: 'staging',
        status: 'success',
        deployed_at: '2026-10-01T15:30:00.000Z',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: deployment.id,
      project_id: deployment.project_id,
      version: 'v1.0.0',
      environment: 'staging',
      status: 'success',
    });
  });

  it('PATCH /api/deployments/:id → should return 404 when the deployment does not exist', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/deployments/999',
      payload: {
        version: 'v1.1.0',
      },
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Deployment not found',
    });
  });

  it('PATCH /api/deployments/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/deployments/invalid',
      payload: {
        version: 'v1.1.0',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/deployments/:id → should reject an empty body', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/deployments/1',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/deployments/:id → should reject additional properties', async () => {
    const deployment = await createTestDeployment();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/deployments/${deployment.id}`,
      payload: {
        version: 'v1.1.0',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('PATCH /api/deployments/:id → should reject an invalid deployed_at format', async () => {
    const deployment = await createTestDeployment();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/deployments/${deployment.id}`,
      payload: {
        deployed_at: 'not-a-date',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // DEPLOYMENTS - DELETE
  it('DELETE /api/deployments/:id → should delete an existing deployment', async () => {
    const deployment = await createTestDeployment();

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/deployments/${deployment.id}`,
    });

    expect(response.statusCode).toBe(204);

    const getResponse = await server.inject({
      method: 'GET',
      url: `/api/deployments/${deployment.id}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it('DELETE /api/deployments/:id → should return 404 when the deployment does not exist', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/deployments/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Deployment not found',
    });
  });

  it('DELETE /api/deployments/:id → should reject an invalid id', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/deployments/invalid',
    });

    expect(response.statusCode).toBe(400);
  });
});
