const express = require('express');
const router = express.Router();
const FormData = require('../models/form-data');
const {checkAuth} = require('../tools/checkAuth');
const admin = require('firebase-admin');
const db = admin.firestore();

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

router.get('/',checkAuth,async (req,res,next) => {
    try{
        const document = await db.collection('forms').doc('testform');
        let item = await document.get();
        let response = item.data();
        return res.json({
            message:'Some form data',
            document:response
        });
    }
    catch(e){
        console.log('error getting protected data',e);
        next()
    }

});

module.exports = {router};