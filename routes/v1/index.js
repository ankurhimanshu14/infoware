const router = require('express').Router();
const auth = require('./auth');

const { registration: userRegistration, authenticate: userAuth, logout: userLogout } = require('../users');
const { registration: productRegistration, browse: productBrowse } = require('../products');
const { createOrders, viewOrders } = require('../orders');
// const { pay, callback } = require('../payments');
const { wallet } = require('../payments');

//ADMIN
router.post('/users/registration', userRegistration.fetchData, userRegistration.saveToMongo, userRegistration.response);
router.post('/users/login', userAuth.fetchLoginDetails, userAuth.searchInMongo, userAuth.verifyUser, userAuth.createToken, userAuth.storeTokenInRedis, userAuth.addTokenToCookie);
router.get('/private/users/logout', auth, userLogout.deleteTokens);

//PRODUCT
router.post('/products/registration', auth, productRegistration.verifyUser, productRegistration.fetchNewProductData, productRegistration.saveProductData, productRegistration.response);
router.post('/products/view', auth, productBrowse.fetchFromMongo, productBrowse.response);

//ORDER
router.post('/orders/new', auth, createOrders.verifyUser, createOrders.fetchData, createOrders.saveToMongo, createOrders.response);
router.get('/orders/view', auth, viewOrders.verifyUser, viewOrders.fetchFromMongo, viewOrders.response);

//PAYMENT
router.post('./payments.payNow', wallet.fetchUserDetails, wallet.fetchOrderDetails, wallet.setPaytmParams, wallet.checkSum, wallet.saveTxnToFirebase);
// router.post('/payments/payNow', auth, pay.verifyUser, pay.fetchPaymentDetails, pay.setPaytmParams, pay.checkSum);
// router.post('/payments/callback', auth, callback.callback);

module.exports = router;