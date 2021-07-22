require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { USER_MODEL } = require('../../models/users');
const redisClient = require('../../config/redis');

const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
    fetchLoginDetails: (req, res, next) => {
        req._loginDetails = {
            _username: req.body.username,
            _clientPassword: req.body.password
        };

        if(!req._loginDetails) {
            res.status(401).json({msg: 'Credentials not entered'}).end();
        } else {
            next();
        }
    },
    searchInMongo: async (req, res, next) => {
        req._foundUser = await USER_MODEL.findOne({ 'username': req._loginDetails._username})
        .then(result => { return result; })
        .catch(err => {
            res.status(401).json({msg: 'Credentials does not match our records.'}).end();
        });
        if(!req._foundUser) {
            res.status(404).json({msg: 'Authentication Failed'}).end();
        } else {
            next();
        }
    },
    
    verifyUser: async (req, res, next) => {
        const { password, ...otherDetails } = req._foundUser;
        req._verifiedUser = await bcrypt.compare(req._loginDetails._clientPassword, password)
                                        .then(result => {
                                            if (result) {
                                                return req._foundUser;
                                            } else {
                                                res.status(404).json({msg: 'Credentials are wrong'}).end();
                                            }
                                        })
                                        .catch(error => next(error));
                                        next();
    },

    createToken: (req, res, next) => {
        if(req._verifiedUser) {
            const { _id, username, userType, ...other } = req._verifiedUser;
            const tokenPayload = { userId: _id, userType: userType, username: username };
            req._newToken = jwt.sign(tokenPayload, secretKey, { algorithm: 'HS256'}, {expiresIn: 60*60*24*7 }, function(err, token) {
                if(err) {
                    console.log(err);
                } else {
                    return token;
                }
            })
            next();
        }
    },

    storeTokenInRedis: (req, res, next) => {
        const { username, ...others } = req._verifiedUser;
        const tokenKey = Date.now() + 5*1000;
        redisClient.zadd(`${username}: TOKEN`, tokenKey, req._newToken, function(error, result) {
            if(error) {
                res.status(500).json({msg: 'Something went wrong!'}).end();
            } else {
                next();
            }
        });
    },

    addTokenToCookie: (req, res, next) => {
        cookieOptions= {
            path: '/',
            expires: new Date(Date.now() + 86400*1000),
            httpOnly: true,
            secure: false,
            sameSite:'strict'
        };
        res.cookie('refreshToken', req._newToken, cookieOptions);
        res.status(200).json({msg:'Authenticated', token: req._newToken}).end();
        next();
    }
}