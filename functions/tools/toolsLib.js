const {cors} = require('./cors');
const {checkKey,requireKey} = require('./checkkey');
const {checkAuth} = require('./checkAuth');

module.exports = {cors,checkKey,checkAuth,requireKey};