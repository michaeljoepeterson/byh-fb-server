const express = require('express');
const router = express.Router();
const FormData = require('../models/form-data');
const {checkAuth} = require('../tools/checkAuth');

router.post('/',(req,res,next) => {
    let {form} = req.body;
    console.log('==========form data: ',form);
    if(!form){
        res.err = {
            message:'No form data'
        }
        next();
    }
    else{
        return res.json({
            message:'Saved Data'
        });
    }
});

router.get('/',checkAuth,(req,res,next) => {
 
    return res.json({
        message:'Some form data'
    });
});

module.exports = {router};