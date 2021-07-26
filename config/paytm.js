require('dotenv').config();

const paytmConfig = {
    mid: process.env.PATYM_MID,
    key: process.env.PAYTM_KEY,
    website: process.env.PAYTM_WEBSITE
};

module.exports.paytmConfig = paytmConfig;