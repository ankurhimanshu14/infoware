require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PRODUCT_FIELDS, PRODUCT_MODEL } = require('../../models/products');

const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    verifyUser: (req, res, next) => {
        const _decrypt = jwt.verify(req.cookies.refreshToken, jwtKey, function(error, result) {
            if(result) {
                return result;
            } else {
                console.log(error);
            };
        });
        //post userIds with the documents created
        req._verifiedUser = (_decrypt && _decrypt.userType === 'admin') ? {status: 401, error: null, data: true, msg: 'Access granted' } : {status: 401, error: null, data: false, msg: 'Access denied' };
        
        next();
    },

    fetchNewProductData: (req, res, next) => {
        
        if (req._verifiedUser.data) {

            req._newProduct = new PRODUCT_MODEL({
                [PRODUCT_FIELDS.SKU]: req.body.sku,
                [PRODUCT_FIELDS.PRODUCT_NAME]: req.body.productName,
                [PRODUCT_FIELDS.DEPARTMENT]: req.body.department,
                [PRODUCT_FIELDS.PRICE]: req.body.price,
                [PRODUCT_FIELDS.SHIPPING_CHARGES]: req.body.shippingCharges,
                [PRODUCT_FIELDS.DIMENSION]: req.body.dimension,
                [PRODUCT_FIELDS.WEIGHT]: req.body.weight,
                [PRODUCT_FIELDS.MATERIAL]: req.body.material,
                [PRODUCT_FIELDS.COLOR]: req.body.color,
                [PRODUCT_FIELDS.UOM]: req.body.uom,
                [PRODUCT_FIELDS.INVENTORY]: req.body.inventory,
                [PRODUCT_FIELDS.IMAGE_URL]: req.body.imageUrl,
                [PRODUCT_FIELDS.MANUFACTURER]: req.body.manufacturer,
                [PRODUCT_FIELDS.RETAILER]: req.body.retailer
            });
    
            // fetch user data here from cookies
            const _decrypt = jwt.verify(req.cookies.refreshToken, jwtKey, function(error, result) {
                if(result) {
                    return result;
                } else {
                    console.log(error);
                };
            });
            //post userIds with the documents created
            if(_decrypt) {
                req._newProduct.createdBy = _decrypt.userId;
            } else console.log("Decryption Error");
        }
        next();
    },

    saveProductData: async (req, res, next) => {
        req._savedProductData = (req._newProduct) ?
            await req._newProduct.save()
            .then(result => { return {status: 200, error: null, data: result, msg: 'Product saved' };})
            .catch(error => { return {status: 401, error: error, data: null, msg: 'Product not saved' }}) : req._verifiedUser;

        next();
    },

    response: async (req, res, next) => {
        const { status, error, data, msg } = (req._savedProductData);
        res.status(status).json({ error: error, data: data, msg: msg }).end();
        next();
    }
}