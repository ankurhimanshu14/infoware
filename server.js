require('dotenv').config();
const express = require('express');
const https = require('https');
const qs = require('querystring');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

const localhost = process.env.LOCALHOST;
const port = process.env.PORT;

const v1Routes = require('./routes/v1');

app.use(cookieParser());
app.use(express.json({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use('/api/v1', v1Routes);

app.listen(port, () => {
    console.log(`Server is listening at http://${localhost}:${port}/`);
});