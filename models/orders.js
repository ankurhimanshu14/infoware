const Schema = require('../config/db');
const mongoose = require('mongoose');
const { PRODUCT_MODEL } = require('./products');

const FIELDS = {
    PRODUCT_ID: 'productId',
    QUANTITY: 'quantity',
    TOTAL_COST: 'totalCost',
    TAXES: 'taxes',
    PAYMENT_METHOD: 'paymentMethod',
    DELIVERY_ADD: 'DeliveryAddress',
    ORDERED_BY: 'orderedBy',
    ORDERED_ON: 'orderedOn',
    UPDATED_BY: 'updatedBy',
    UPDATED_ON: 'updatedOn',
    STATUS: 'status'
};

const SCHEMA = {
    [FIELDS.PRODUCT_ID]: { type: Schema.Types.ObjectId, required: true, ref: 'Product'},
    [FIELDS.QUANTITY]: { type: Number, required: true, default: 1 },
    [FIELDS.TOTAL_COST]: { type: Number, required: true },
    [FIELDS.TAXES]: { type: Number, required: true },
    [FIELDS.PAYMENT_METHOD]: { type: String, enum: ['Debit Card', 'Credit Card', 'Cash On Delivery'], required: true},
    [FIELDS.DELIVERY_ADD]: { type: String, required: true },
    [FIELDS.ORDERED_BY]: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    [FIELDS.ORDERED_ON]: { type: Date, default: Date.now },
    [FIELDS.UPDATED_BY]: { type: Schema.Types.ObjectId, ref: 'User' },
    [FIELDS.UPDATED_ON]: { type: Date },
    [FIELDS.STATUS]: { type: String, enum: ['In transit', 'Delivered', 'Under Packaging', 'Cancelled'], required: true, default: 'Under Packaging' },
};

const orderSchema = new Schema(SCHEMA);

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

orderSchema.pre('save', async function(next) {
    await PRODUCT_MODEL.findOne({'productId': this.productId})
    .populate('price', 'shippingCharges')
    .then(price => {
        this.totalCost = price * this.quantity + shippingCharges;
        this.taxes = this.totalCost * 0.18;
        console.log(this.totalCost,this.taxes);
        next();
    })
    .catch(err => {
        return next(err);
    })
});