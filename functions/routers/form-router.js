const express = require('express');
const router = express.Router();
const FormData = require('../models/form-data');
const {checkAuth} = require('../tools/checkAuth');
const {formDatabase} = require('../db/form-interface');
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
            await formDatabase.saveForm(form);
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
        let {dateField,fromDate,toDate} = req.query;
        let options = {
            start:fromDate ? new Date(fromDate) : null,
            end:toDate ? new Date(toDate) : null,
            dateField
        };
        const data = await formDatabase.getForms(project,options);

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

router.get('/fields',checkAuth,async (req,res,next) => {
    try{
        let {project} = req;
        const data = await formDatabase.getProjectFields(project);

        return res.json({
            message:'Project Fields',
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