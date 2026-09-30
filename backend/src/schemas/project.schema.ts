export const createProjectSchema = {
  body: {
    type: 'object',
    required: [
      'lab_id',
      'name',
    ],
    additionalProperties: false,
    properties: {
      lab_id: {
        type: 'integer',
        minimum: 1,
      },
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      description: {
        type: 'string',
        maxLength: 500,
      },
      repository_url: {
        type: 'string',
        maxLength: 500,
        format: 'uri',
      },
    },
  },
};

export const getProjectByIdSchema = {
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

export const patchProjectSchema = {
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
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      description: {
        type: 'string',
        maxLength: 500,
      },
      repository_url: {
        type: 'string',
        maxLength: 500,
        format: 'uri',
      },
    },
  },
};
