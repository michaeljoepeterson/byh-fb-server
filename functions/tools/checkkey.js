const {SECRET} = require('../config');
const {FormData} = require('../models/form-data');

const checkKey = (key) => {
    var buf = Buffer.from(key, 'base64').toString();
    if(buf === SECRET){
        return true;
    }
    else{
        return false;
    }
}

module.exports = {checkKey};