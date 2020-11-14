const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {requireKey,checkAuth} = require('../tools/toolsLib');
const {userDatabase} = require('../db/user-interface');
const NodeCache = require( "node-cache" );
//reset cache every hour
let timeOutDefault = (60) * 60;
let checkPeriod = (60) * 65;
const myCache = new NodeCache({ stdTTL: timeOutDefault, checkperiod: checkPeriod });


//short term until front end built out require a key if using api to create user
router.post('/',checkAuth, async (req,res,next) => {
    try{
        let {user} = req.body;
        let existingUser = myCache.get(req.user.email);
        if(existingUser){
            return res.json({
                message:'Existing user'
            });
        }
        else{
            let foundUser = await userDatabase.getUser(req.user.project,req.user.email);
            if(!foundUser){
                console.log('saving user');
                await userDatabase.saveUser(user);

            }
            else{
                console.log('caching user',foundUser);
                myCache.set( req.user.email, foundUser );
            }
        }
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
        let existingUser = myCache.get(email);
        if(existingUser){
            console.log('found cached user: ');
            return res.json({
                user:existingUser
            });
        }
        else{
            let user = await userDatabase.getUser(project,email);
            myCache.set( email, user );
            console.log('found db user: ');
            res.status(200);
            return res.json({
                user:user
            });
        }

    }
    catch(e){
        res.err = e;
        console.log('error getting user: ',e);
        next();
    }

});

module.exports = {router};