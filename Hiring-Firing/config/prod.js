require('dotenv').config();
module.exports = {
    googleClientID: process.env.googleClientID,
    googleClientSecret: process.env.googleClientSecret,
    mongoURI: process.env.mongoURI,
    cookieKey: process.env.cookieKey,
    baseURL: process.env.baseURL
};