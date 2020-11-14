const express = require('express');
const router = express.Router();
const functions = require('firebase-functions');
const {router:formRouter} = require('./form-router');
const {router:userRouter} = require('./user-router');


router.get('/test',(req,res) => {
    res.status = 200;
    console.log('hit test router');
    return res.json({
        message:'hello world'
    });
});

router.use('/forms',formRouter);
router.use('/users',userRouter);

module.exports = {router};