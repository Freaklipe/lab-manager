import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

interface PackageJson {
  version: string;
}

const packageJson = require('../../package.json') as PackageJson;

export interface VersionResponse {
  version: string;
  commit: string;
}

export const getVersion = (): VersionResponse => {
  return {
    version: packageJson.version,
    commit: process.env.APP_COMMIT ?? 'dev',
  };
};
