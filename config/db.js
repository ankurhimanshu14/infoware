require('dotenv').config();
const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI;

const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true 
};

mongoose.connect(dbUri, dbOptions);
mongoose.Promise = global.Promise;

const conn = mongoose.connection;

conn.on('connected', () => {
    console.log('Mongoose is connected.');
});

conn.on('error', (e) => {
    console.log('Mongoose error: ' + e);
});

conn.on('disconnected', () => {
    console.log('Mongoose is disconnected.');
});

process.on('SIGINT', () => {
    conn.close(() => {
        console.log('Mongoose is disconnected through app temination');
        process.exit(0);
    });
});

module.exports = mongoose.Schema;