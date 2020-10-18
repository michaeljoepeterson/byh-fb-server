const express = require('express');
const router = express.Router();
const {router:formRouter} = require('./form-router');

router.get('/test',(req,res) => {
    res.status = 200;
    console.log('hit test router');
    return res.json({
        message:'hello world'
    });
});

router.use('/forms',formRouter);

module.exports = {router};