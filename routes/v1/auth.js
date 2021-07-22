require('dotenv').config();
const session = require('express-session')
const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis');

const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = function auth(req, res, next) {
    const _token = req.cookies.refreshToken;
    if(!_token) {
        return res.status(401).send({ error: 'Hey! You need to login'});
    }

    const decrypt = jwt.verify(_token, jwtKey, function(error, result) {

        if(result) {
            return result;
        } else {
            console.log(error);
        };
    });

    let args = [`${decrypt.username}: TOKEN`, 0, Date.now()];

    redisClient.zrangebyscore(args, function(error, listOfTokens) {
        if(!listOfTokens.includes(_token)) {
            console.log('Token expired');
            res.clearCookie('refreshToken');
            res.status(404).end();
        } else {
            req.session.loggedIn = true
            next();
        }
    })
}