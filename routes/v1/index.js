const router = require('express').Router();
const auth = require('./auth');

const { registration: userRegistration, authenticate: userAuth, logout: userLogout } = require('../users');
const { registration: productRegistration, browse: productBrowse, createOrders: createOrders } = require('../products');

//ADMIN
router.post('/users/registration', userRegistration.fetchData, userRegistration.saveToMongo, userRegistration.response);
router.post('/users/login', userAuth.fetchLoginDetails, userAuth.searchInMongo, userAuth.verifyUser, userAuth.createToken, userAuth.storeTokenInRedis, userAuth.addTokenToCookie);
router.get('/private/users/logout', auth, userLogout.deleteTokens);

//PRODUCT
router.post('/products/registration', auth, productRegistration.verifyUser, productRegistration.fetchNewProductData, productRegistration.saveProductData, productRegistration.response);
router.post('/products/view', auth, productBrowse.fetchFromMongo, productBrowse.response);
router.post('/products/order', auth, createOrders.fetchData, createOrders.saveToMongo, createOrders.response);

module.exports = router;