const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {requireKey} = require('../tools/toolsLib');
const {userDatabase} = require('../db/user-interface');

//to do add auth
router.get('/',(rqe,res,next) => {
    let user = new User();
    let userKeys = user.getDataNames();
    return res.json({
        data:userKeys
    });
});
//short term until front end built out require a key if using api to create user
router.post('/',requireKey, async (req,res,next) => {
    let {user} = req.body
    try{
        await userDatabase.saveUser(user)
        return res.json({
            message:'Saved Data'
        });
    }
    catch(e){
        res.err = e;
        next();
    }
});

module.exports = {router};