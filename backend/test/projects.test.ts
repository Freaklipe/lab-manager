import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { server } from '../src/app.js';
import { cleanDatabase } from './setup.js';

const createTestProject = async () => {
  const labResponse = await server.inject({
    method: 'POST',
    url: '/api/labs',
    payload: {
      name: 'Test Lab',
      description: 'Lab for automated tests',
    },
  });

  expect(labResponse.statusCode).toBe(201);

  const lab = labResponse.json();

  const projectResponse = await server.inject({
    method: 'POST',
    url: '/api/projects',
    payload: {
      lab_id: lab.id,
      name: 'Test Project',
      description: 'Project for automated tests',
      repository_url: 'https://github.com/test/project',
    },
  });

  expect(projectResponse.statusCode).toBe(201);

  return projectResponse.json();
};

describe('Projects API', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await server.close();
  });

  // PROJECTS — GET
  it('GET /api/projects → should return an empty array when there are no projects', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/projects',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('GET /api/projects/:id → should return a project by id', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'GET',
      url: `/api/projects/${project.id}`,
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: project.id,
      lab_id: project.lab_id,
      name: 'Test Project',
      description: 'Project for automated tests',
      repository_url: 'https://github.com/test/project',
    });
  });

  it('GET /api/projects/:id → should return 404 when the project does not exist', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/projects/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Project not found',
    });
  });

  // PROJECTS — POST
  it('POST /api/projects → should create a project', async () => {
    const labResponse = await server.inject({
      method: 'POST',
      url: '/api/labs',
      payload: {
        name: 'Test Lab',
        description: 'Lab for automated tests',
      },
    });

    expect(labResponse.statusCode).toBe(201);

    const lab = labResponse.json();

    const response = await server.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        lab_id: lab.id,
        name: 'Test Project',
        description: 'Project for automated tests',
        repository_url: 'https://github.com/test/project',
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toMatchObject({
      lab_id: lab.id,
      name: 'Test Project',
      description: 'Project for automated tests',
      repository_url: 'https://github.com/test/project',
    });
  });

  it('POST /api/projects → should reject a request with missing required fields', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        lab_id: 1,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/projects → should reject a project with a non-existent lab', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        lab_id: 999,
        name: 'Test Project',
        description: 'Project for automated tests',
        repository_url: 'https://github.com/test/project',
      },
    });

    expect(response.statusCode).toBe(409);
  });

  it('POST /api/projects → should reject an invalid lab_id type', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        lab_id: 'invalid',
        name: 'Test Project',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/projects → should reject additional properties', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        lab_id: 1,
        name: 'Test Project',
        unexpected: 'not allowed',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /api/projects → should reject an invalid repository_url', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        lab_id: 1,
        name: 'Test Project',
        repository_url: 'not-a-valid-url',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // PROJECTS — PATCH
  it('PATCH /api/projects/:id → should update an existing project', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'PATCH',
      url: `/api/projects/${project.id}`,
      payload: {
        name: 'Updated Project',
      },
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      id: project.id,
      lab_id: project.lab_id,
      name: 'Updated Project',
      description: 'Project for automated tests',
      repository_url: 'https://github.com/test/project',
    });
  });

  it('PATCH /api/projects/:id → should return 404 when the project does not exist', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/projects/999',
      payload: {
        name: 'Updated Project',
      },
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Project not found',
    });
  });

  it('PATCH /api/projects/:id → should reject an empty body', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/projects/1',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  // PROJECTS — DELETE
  it('DELETE /api/projects/:id → should delete an existing project', async () => {
    const project = await createTestProject();

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/projects/${project.id}`,
    });

    expect(response.statusCode).toBe(204);

    const getResponse = await server.inject({
      method: 'GET',
      url: `/api/projects/${project.id}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it('DELETE /api/projects/:id → should return 404 when the project does not exist', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/projects/999',
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      error: 'Project not found',
    });
  });
});
