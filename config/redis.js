const redis = require('redis');

module.exports = redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Redis client connected.');
});
redisClient.on('error', (error) => {
    console.log('Redis is not connected ' + error);
});
redisClient.on("ready", (error) => {
    redisNotReady = false;
    console.log("Ready");
});