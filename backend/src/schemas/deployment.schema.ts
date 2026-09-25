export const createDeploymentSchema = {
  body: {
    type: 'object',
    required: [
      'project_id',
      'version',
      'environment',
      'status',
    ],
    additionalProperties: false,
    properties: {
      project_id: {
        type: 'integer',
        minimum: 1,
      },
      version: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      environment: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
      status: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
      deployed_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
};

export const getDeploymentByIdSchema = {
  params: {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9]+$',
      },
    },
  },
};

export const patchDeploymentSchema = {
  params: {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9]+$',
      },
    },
  },
  body: {
    type: 'object',
    minProperties: 1,
    additionalProperties: false,
    properties: {
      version: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      environment: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
      status: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
      deployed_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
};
