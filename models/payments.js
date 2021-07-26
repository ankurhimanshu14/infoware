const Schema = require('../config/db');
const mongoose = require('mongoose');

const FIELDS = {
    TXN_DETAILS: 'txnDetails',
    AMOUNT: 'amount',
    CURRENCY: 'currency',
    CUSTOMER_ID: 'customerId',
    CUSTOMER_EMAIL: 'customerEmail',
    CUSTOMER_PHONE: 'customerPhone',
    TRANSACTION_DATE: 'tranactionDate'
};

const SCHEMA = {
    [FIELDS.TXN_DETAILS]: {
        [FIELDS.AMOUNT]: { type: Number, required: true },
        [FIELDS.CURRENCY]: { type: String, enum: ['INR', 'USD', 'AUD', 'YEN', 'EUR'], required: true }
    },
    [FIELDS.CUSTOMER_ID]: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    [FIELDS.CUSTOMER_EMAIL]: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    [FIELDS.CUSTOMER_PHONE]: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    [FIELDS.TRANSACTION_DATE]: { type: Date, default: Date.now }
};

const paymentSchema = new Schema(SCHEMA);

paymentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

module.exports = {
    PAYMENT_FIELDS: FIELDS,
    PAYMENT_MODEL: mongoose.model('Payment', paymentSchema)
};