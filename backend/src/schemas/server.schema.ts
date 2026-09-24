export const createServerSchema = {
  body: {
    type: 'object',
    required: [
      'lab_id',
      'name',
      'status',
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
      hostname: {
        type: 'string',
        maxLength: 255,
      },
      ip_address: {
        type: 'string',
        maxLength: 45,
      },
      operating_system: {
        type: 'string',
        maxLength: 100,
      },
      status: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
    },
  },
};

export const getServerByIdSchema = {
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

export const patchServerSchema = {
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
      hostname: {
        type: 'string',
        maxLength: 255,
      },
      ip_address: {
        type: 'string',
        maxLength: 45,
      },
      operating_system: {
        type: 'string',
        maxLength: 100,
      },
      status: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
    },
  },
};
