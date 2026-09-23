export const createLabSchema = {
  body: {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      description: {
        type: 'string',
      },
    },
  },
};

export const getLabByIdSchema = {
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

export const patchLabSchema = {
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
      },
    },
  },
};
