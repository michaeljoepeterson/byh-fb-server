const express = require('express');
const router = express.Router();

router.get('/test',(req,res) => {
    res.status = 200;
    return res.json({
        message:'hello world'
    });
});

module.exports = {router};