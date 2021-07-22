require('dotenv').config();
const jwt = require('jsonwebtoken');
const { ORDER_FIELDS, ORDER_MODEL } = require('../../models/orders');
const { PRODUCT_MODEL } = require('../../models/products');

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
        req._verifiedUser = (_decrypt && _decrypt.userType === 'user') ? {status: 401, error: null, data: true, msg: 'Access granted' } : {status: 401, error: null, data: false, msg: 'Access denied' };
        
        next();
    },

    fetchData: async (req, res, next) => {
        if(req._verifiedUser.data) {
            req._newOrderList = [];
        
            req._selectedProduct = await new ORDER_MODEL({
                [ORDER_FIELDS.PRODUCT_ID]: req.body.productId,
                [ORDER_FIELDS.QUANTITY]: req.body.quantity
            });
    
            const _decrypt = jwt.verify(req.cookies.refreshToken, jwtKey, function(error, result) {
                if(result) {
                    return result;
                } else {
                    console.log(error);
                };
            });
            //post userIds with the documents created
            if(_decrypt) {
                req._selectedProduct.orderedBy = _decrypt.userId;
            } else console.log("Decryption Error");
    
            let item = await PRODUCT_MODEL.findOne({'_id': req._selectedProduct.productId })
                .then(result => {return result})
                .catch(err => { return {status: 500, data: null, error: err, msg: 'Error in fetching stock details'}});
    
                if (req._selectedProduct.quantity <= item.inventory) {
                    req._newOrderList.push(req._selectedProduct);
                } else {
                    res.send("Ordered Quantity is in excess of available stock");
                }
    
            next();
        } else {
            res.send("You are not authorize to place order as an Admin");
        }
    },

    saveToMongo: async(req, res, next) => {

        for (let item of req._newOrderList) {
            req._savedOrderList = await item.save()
            .then(result => { return { status: 201, data: result, error: null, msg: 'Order created!'}; })
            .catch(error => { return { status: 400, data: null, error: error, msg: 'Order not created!'}; });
        }

        next();
    },

    response: (req, res, next) => {
        const { status, data, error, msg } = req._savedOrderList;

        res.status(status).json({ error, data, msg }).end();
        next();
    }
}