const { ORDER_MODEL } = require('../../models/orders');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    verifyUser: (req, res, next) => {
        req._decrypt = jwt.verify(req.cookies.refreshToken, jwtKey, function(error, result) {
            if(result) {
                return result;
            } else {
                console.log(error);
            };
        });
        //post userIds with the documents created
        req._verifiedUser = (req._decrypt && req._decrypt.userType === 'admin') ? {status: 401, error: null, data: true, msg: 'Access granted' } : {status: 401, error: null, data: false, msg: 'Access denied' };
        
        next();
    },

    fetchFromMongo: async (req, res, next) => {

        if (req._verifiedUser.data) {
            req._orderDetails = await  ORDER_MODEL.find()
            .then(result => {
                return { status: 200, error: null, data: result, msg: 'Orders Found' }
            })
            .catch(err => {
                return { status: 400, error: err, data: null, msg: 'Error in fetching order' }
            })
        } else {
            req._orderDetails = await  ORDER_MODEL.findOne({ 'orderedBy': req._decrypt.userId })
            .then(result => {
                return { status: 200, error: null, data: [result], msg: 'orders Found' }
            })
            .catch(err => {
                return { status: 400, error: err, data: null, msg: 'Error in fetching order' }
            })
        }

        next();
    },

    response: (req, res, next) => {
        const { status, error, data, msg } = req._orderDetails;
        res.status(status).json({ error, data, msg }).end();

        next();
    }
}