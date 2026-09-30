export const createServiceSchema = {
  body: {
    type: 'object',
    required: [
      'server_id',
      'name',
      'status',
    ],
    additionalProperties: false,
    properties: {
      server_id: {
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
      port: {
        type: 'integer',
        minimum: 1,
        maximum: 65535,
      },
      status: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
    },
  },
};

export const getServiceByIdSchema = {
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

export const patchServiceSchema = {
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
      port: {
        type: 'integer',
        minimum: 1,
        maximum: 65535,
      },
      status: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
    },
  },
};
