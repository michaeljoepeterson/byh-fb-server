const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {requireKey,checkAuth} = require('../tools/toolsLib');
const {userDatabase} = require('../db/user-interface');


//short term until front end built out require a key if using api to create user
router.post('/',requireKey, async (req,res,next) => {
    try{
        let {user} = req.body
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

router.get('/',checkAuth,async (req,res,next) => {
    try{
        let {email,project} = req.user;
        let docs = await userDatabase.getUser(project,email);
        res.status(200);
        return res.json({
            user:docs
        });

    }
    catch(e){
        res.err = e;
        console.log('error getting user: ',e);
        next();
    }

});

module.exports = {router};