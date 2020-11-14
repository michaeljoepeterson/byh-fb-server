const express = require('express');
const router = express.Router();
const FormData = require('../models/form-data');
const {checkAuth} = require('../tools/checkAuth');
const {database} = require('../db/form-interface');
const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/',async (req,res,next) => {
    let {form} = req.body;
    console.log('==========form data: ',form);
    if(!form){
        res.err = {
            message:'No form data'
        }
        next();
    }
    else{
        try{
            await database.saveForm(form);
            return res.json({
                message:'Saved Data'
            });
        }
        catch(e){
            console.warn('error saving form: ',e);
            res.err = e;
            next();
        }
    }
});

router.get('/',checkAuth,async (req,res,next) => {
    try{
        let {project} = req;
        const data = await database.getForms(project);

        return res.json({
            message:'Some form data',
            documents:data
        });
    }
    catch(e){
        console.log('error getting protected data',e);
        res.err = e;
        next();
    }

});

module.exports = {router};