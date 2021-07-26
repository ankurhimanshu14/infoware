"use strict";
const https = require('https');
const PaytmChecksum = require('./PaytmChecksum');
const firebase = require('firebase');

let db = firebase.database();

module.exports = {
    fetchUserDetails: (req, res, next) => {
    
        req._user = db.ref().child("Users").once("value", (snapshot) => {
            if(snapshot.val() === null) {
                res.json(
                    {
                        "message": "No data found",
                        "result": false,
                        "data": null
                    }
                );
            } else {
                res.json(
                    {
                        "message": "Data fetched successfully",
                        "result": true,
                        "data": snapshot.val()
                    }
                );
            }
        });

        next();
    },

    fetchOrderDetails: (req, res, next) => {
        let db = firebase.database();
        req._order = db.ref().child("Orders").once("value", (snapshot) => {
            if(snapshot.val() === null) {
                res.json(
                    {
                        "message": "No data found",
                        "result": false,
                        "data": null
                    }
                );
            } else {
                res.json(
                    {
                        "message": "Data fetched successfully",
                        "result": true,
                        "data": snapshot.val()
                    }
                );
            }
        });

        next();
    },

    setPaytmParams: (req, res, next) => {
        let paytmParams = {};

        paytmParams["subwalletGuid"] = "";
        paytmOrderId["orderId"] = req._order.orderId;
        paytmParams["beneficiaryPhoneNo"] = req._user.phoneNo;
        paytmParams["amount"] = req.body.amount;

        req._params = JSON.stringify(paytmParams);

        next();
    },

    checkSum: (req, res, next) => {
        PaytmChecksum.generateSignature(req._params, "YOUR_MERCHANT_KEY").then(function(checksum){

            let x_mid      = "YOUR_MID_HERE";
            let x_checksum = checksum;
        
            let options = {
        
                /* for Staging */
                hostname: 'staging-dashboard.paytm.com',
        
                /* for Production */
                // hostname: 'dashboard.paytm.com',
        
                /* Solutions offered are: food, gift, gratification, loyalty, allowance, communication */
                path: '/bpay/api/v1/disburse/order/wallet/{solution}',
                port: 443,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-mid': x_mid,
                    'x-checksum': x_checksum,
                    'Content-Length': req._params.length
                }
            };
        
            let response = "";
            let post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });
        
                post_res.on('end', function(){
                    console.log('Response: ', response);
                });
            });
        
            post_req.write(req._params);
            post_req.end();
        });

        next();
    },

    saveTxnToFirebase: (req, res, next) => {
        db.ref("Transactions").set(req._params, function(error) {
            if(error) {
                res.json(
                    {
                        "message": "Transaction Failed",
                        "result": false,
                        "data": null
                    }
                );
            } else {
                res.json(
                    {
                        "message": "Transaction completed successfully",
                        "result": true
                    }
                );
            }
        });
    }
}