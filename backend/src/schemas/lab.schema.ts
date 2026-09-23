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
