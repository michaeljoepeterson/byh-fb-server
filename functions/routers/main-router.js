const express = require('express');
const router = express.Router();
const functions = require('firebase-functions');
const {router:formRouter} = require('./form-router');
const config = functions.config()

router.get('/test',(req,res) => {
    res.status = 200;
    console.log('hit test router',config);
    return res.json({
        message:'hello world'
    });
});

router.use('/forms',formRouter);

module.exports = {router};