  
const { PRODUCT_MODEL } = require('../../models/products');
const fs = require('fs');
require('dotenv').config();

module.exports = {

    fetchFromMongo: async (req, res, next) => {

        if (req.body.query) {
            req._productDetails = await  PRODUCT_MODEL.findOne({ 'productName': req.body.query })
            .then(result => {
                return { status: 200, error: null, data: [result], msg: 'Products Found' }
            })
            .catch(err => {
                return { status: 400, error: err, data: null, msg: 'Error in fetching product' }
            })
        } else {
            req._productDetails = await  PRODUCT_MODEL.find()
            .then(result => {
                return { status: 200, error: null, data: result, msg: 'Products Found' }
            })
            .catch(err => {
                return { status: 400, error: err, data: null, msg: 'Error in fetching product' }
            })
        }

        next();
    },

    response: (req, res, next) => {
        const { status, error, data, msg } = req._productDetails;
        res.status(status).json({ error, data, msg }).end();

        next();
    }
}