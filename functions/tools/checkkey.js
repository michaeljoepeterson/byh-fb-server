const {SECRET} = require('../config');

const checkKey = (key) => {
    if(key === SECRET){
        return true;
    }
    else{
        return false;
    }
}

module.exports = {checkKey};