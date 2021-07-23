const Schema = require('../config/db');
const mongoose = require('mongoose');
const { PRODUCT_MODEL } = require('./products');

const FIELDS = {
    PRODUCT_ID: 'productId',
    QUANTITY: 'quantity',
    TOTAL_COST: 'totalCost',
    ORDERED_BY: 'orderedBy',
    ORDERED_ON: 'orderedOn',
    UPDATED_BY: 'updatedBy',
    UPDATED_ON: 'updatedOn',
    STATUS: 'status'
};

const SCHEMA = {
    [FIELDS.PRODUCT_ID]: { type: Schema.Types.ObjectId, required: true, ref: 'Product'},
    [FIELDS.QUANTITY]: { type: Number, required: true },
    [FIELDS.TOTAL_COST]: { type: Number },
    [FIELDS.ORDERED_BY]: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    [FIELDS.ORDERED_ON]: { type: Date, default: Date.now },
    [FIELDS.UPDATED_BY]: { type: Schema.Types.ObjectId, ref: 'User' },
    [FIELDS.UPDATED_ON]: { type: Date },
    [FIELDS.STATUS]: { type: String, enum: ['In transit', 'Delivered', 'Under Packaging', 'Cancelled'], required: true, default: 'Under Packaging' },
};

const orderSchema = new Schema(SCHEMA);

orderSchema.pre('save', async function(next) {

    this.totalCost = await PRODUCT_MODEL.findOne({ '_id': this.productId})
    .then(result => { return result.price * this.quantity + result.shippingCharges })
    .catch(error => { console.log(error) });

    next();
});

orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

module.exports = {
    ORDER_FIELDS: FIELDS,
    ORDER_MODEL: mongoose.model('Order', orderSchema)
};