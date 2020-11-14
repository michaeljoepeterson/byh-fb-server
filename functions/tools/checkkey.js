const {SECRET} = require('../config');

const checkKey = (key) => {
    var buf = Buffer.from(key, 'base64').toString();
    if(buf === SECRET){
        return true;
    }
    else{
        return false;
    }
}

const requireKey = (req, res, next) => {
    let {client_token} = req.headers;
    let hasKey = checkKey(client_token);
    if(hasKey){
        next();
    }
    else{
        res.status(422);
        return res.json({
            code:422,
            message:'Unauthorized'
        });
    }
}

module.exports = {checkKey,requireKey};