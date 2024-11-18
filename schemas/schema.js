const Ajv = require('ajv');
const ajv = new Ajv();

const paymentSchema = {
  properties: {
    sourceId: { type: 'string' },
    locationId: { type: 'string' },
    idempotencyKey: { type: 'string' },
    amount: { type: 'integer' },
    currency: { type: 'string' },
    verificationToken: { type: 'string', nullable: true },
  },
  required: ['sourceId', 'locationId', 'idempotencyKey', 'amount', 'currency'],
  additionalProperties: false
};

const validatePayment = ajv.compile(paymentSchema);

module.exports = {
  validatePayment
};
