require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PAYMENT_FIELDS, PAYMENT_MODEL } = require('../../models/payments');
const paytmConfig = require('../../config/paytm');
const { USER_MODEL } = require('../../models/users');

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

    fetchPaymentDetails: async (req, res, next) => {

        const userDetails = await USER_MODEL.findOne({'_id': req._verifiedUser.userId})
        .then(result => { return result })
        .catch( error => { return error });


        req._paymentDetails = await new PAYMENT_MODEL({
            [PAYMENT_FIELDS.AMOUNT]: req.body.amount,
            [PAYMENT_FIELDS.CUSTOMER_ID]: req.body.customerId,
            [PAYMENT_FIELDS.CUSTOMER_EMAIL]: userDetails.email,
            [PAYMENT_FIELDS.CUSTOMER_PHONE]: userDetails.contact
        })
        .then(result => { return result})
        .catch(error => { return error });
        
        return (!req._paymentDetails.amount || !req._paymentDetails.customerId || !req._paymentDetails.customerEmail || !req._paymentDetails.customerPhone) ? res.status(400).send('Payment failed').end() : next();
    },

    setPaytmParams: (req, res, next) => {
        req._params = {};

        req._params['MID'] = config.PaytmConfig.mid;
        req._params['WEBSITE'] = config.PaytmConfig.website;
        req._params['CHANNEL_ID'] = 'WEB';
        req._params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
        req._params['CUST_ID'] = req._paymentDetails.customerId;
        req._params['TXN_AMOUNT'] = req._paymentDetails.amount;
        req._params['CALLBACK_URL'] = 'http://localhost:5000/api/v1/payments/callback';
        req._params['EMAIL'] = req._paymentDetails.customerEmail;
        req._params['MOBILE_NO'] = req._paymentDetails.customerPhone;

        next();
    },

    checkSum: (req, res, next) => {
        checksum_lib.genchecksum(req._params, config.PaytmConfig.key, function (err, checksum) {
            const txnUrl = "https://securegw-stage.paytm.in/theia/processTransaction";
    
            let formFields = "";
            for (let p in params) {
                formFields += "<input type='hidden' name='" + p + "' value='" + params[p] + "' >";
            }
            formFields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
    
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            res.end();
        });

        next();
    }
}