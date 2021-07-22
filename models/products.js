const Schema = require('../config/db');
const mongoose = require('mongoose');

const FIELDS = {
    SKU: 'sku',
    PRODUCT_NAME: 'productName',
    DEPARTMENT: 'department',
    PRICE: 'price',
    SHIPPING_CHARGES: 'shippingCharges',
    DIMENSION: 'dimension',
    WEIGHT: 'weight',
    MATERIAL: 'material',
    COLOR: 'color',
    UOM: 'uom',
    INVENTORY: 'inventory',
    IMAGE_URL: 'imageUrl',
    MANUFACTURER: 'manufacturer',
    RETAILER: 'retailer',
    CREATED_BY: 'createdBy',
    CREATED_ON: 'createdOn',
    UPDATED_BY: 'updatedBy',
    UPDATED_ON: 'updatedOn'
};

const SCHEMA = {
    [FIELDS.SKU]: {type: String, required: true, unique: true },
    [FIELDS.PRODUCT_NAME]: { type: String, required: true },
    [FIELDS.DEPARTMENT]: [{type: String, required: true }],
    [FIELDS.PRICE]: { type: Number, required: true },
    [FIELDS.SHIPPING_CHARGES]: { type: Number, required: true, default: 0 },
    [FIELDS.DIMENSION]: { type: String, required: true },
    [FIELDS.WEIGHT]: { type: Number, required: true },
    [FIELDS.MATERIAL]: { type: String, required: true },
    [FIELDS.COLOR]: { type: String, required: true },
    [FIELDS.UOM]: { type: String, required: true },
    [FIELDS.INVENTORY]: { type: Number, required: true, default: 0},
    [FIELDS.IMAGE_URL]: { type: String },
    [FIELDS.MANUFACTURER]: { type: String, required: true },
    [FIELDS.RETAILER]: { type: String, required: true },
    [FIELDS.CREATED_BY]:  { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    [FIELDS.CREATED_ON]: { type: Date, default: Date.now },
    [FIELDS.UPDATED_BY]:  { type: Schema.Types.ObjectId, ref: 'User' },
    [FIELDS.UPDATED_ON]: { type: Date }
};

const productSchema = new Schema(SCHEMA);

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

module.exports = {
    PRODUCT_FIELDS: FIELDS,
    PRODUCT_MODEL: mongoose.model('Product', productSchema)
};