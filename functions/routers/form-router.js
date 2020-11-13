const express = require('express');
const router = express.Router();
const FormData = require('../models/form-data');
const {checkAuth} = require('../tools/checkAuth');
const {database} = require('../db/db-interface');
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
            /*
            let formData = new FormData(form);
            let saveData = formData.serialize();
            console.log('==========form instance: ',saveData);
            let id = String(saveData.referralNum);
            await db.collection('forms').doc(id).set(saveData);
            */
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
        //let offsetDays = 30;
        //let end = new Date();
        //let start = new Date();
        //start.setDate(start.getDate() - offsetDays);
        //let dataNames = FormData.getDataNames();
        let {project} = req;
        /*
        const documents = await db.collection('forms')
        .where(dataNames.project, '==',project)
        .where(dataNames.referralDate,'>',start)
        .where(dataNames.referralDate,'<',end).get()
        ;

        const data = [];
        documents.forEach(doc =>{
            let docData = doc.data();
            if(docData.referralDate){
                docData.referralDate = docData.referralDate.toDate();
            }
            data.push(docData);
        });
        */
        //let db = new DbInterface(project);
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