const {DOMAINS} = require('../config');
const {checkKey} = require('./checkkey');
const cors = (req, res, next) => {
    let origin = req.headers.origin;
    let allowedOrigins = DOMAINS.split(',');
    console.log('origin',origin);
    let {client_token} = req.headers;
    //console.log('token=====',client_token);
    if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
    }
    else if(client_token){
        let hasKey = checkKey(client_token);
        if(hasKey){
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
        else{
            res.status(422);
            return res.json({
                code:422,
                message:'Unauthorized'
            });
        }
    }
    else{
        res.status(422);
        return res.json({
            code:422,
            message:'Unauthorized'
        });
    }
    
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,authtoken,project');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
};

module.exports = {cors};