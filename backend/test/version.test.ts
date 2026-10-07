import { createRequire } from 'node:module';
import { afterAll, describe, expect, it } from 'vitest';

import { server } from '../src/app.js';

const require = createRequire(import.meta.url);

interface PackageJson {
  version: string;
}

const packageJson = require('../package.json') as PackageJson;

describe('GET /api/version', () => {
  afterAll(async () => {
    await server.close();
  });

  it('should return the application version', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/version',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      version: packageJson.version,
      commit: process.env.APP_COMMIT ?? 'dev',
    });
  });
});
