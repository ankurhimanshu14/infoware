require('dotenv').config();
const jwt = require('jsonwebtoken');
const redisClient = require("../../config/redis");

const jwtKey = process.env.JWT_SECRET_KEY;


module.exports = {
    deleteTokens: async (req, res, next) => {

        const decrypt = jwt.verify(req.cookies.refreshToken, jwtKey, function(error, result) {
            if(result) {
                return result;
            } else {
                console.log(error);
            };
        });

        let args = [`${decrypt.username}: TOKEN`, 0, Date.now()];

        redisClient.zrangebyscore(args, function(error, listOfTokens) {
            if(listOfTokens.includes(req.cookies.refreshToken)) {
                redisClient.zrem(`${decrypt.username}: TOKEN`, req.cookies.refreshToken, function(error, result) {
                    if(result) {
                        res.clearCookie('refreshToken');
                        res.status(200).json({error: null, data:'You are logged out'}).end();
                    } else {
                        res.status(500).json({error: error, data: null, msg: 'You are still logged in'});
                    }
                })
            } else {
                console.log(`Error in listing the tokens from ${decrypt.username}: TOKEN`);
            }
        })
    }
}