const admin = require('firebase-admin');
const FormData = require('../models/form-data');
const {BaseInterface} = require('./base-interface');
const db = admin.firestore();

class DbInterface extends BaseInterface{
    constructor(){
        super();
        this.db = db;
    }

    async saveForm(form){
        try{
            let formData = new FormData(form);
            let saveData = formData.serialize();
            console.log('==========form instance: ',saveData);
            let id = String(saveData.referralNum);
            await this.db.collection('forms').doc(id).set(saveData);
            
            return true;
        }
        catch(e){
            console.warn('error saving form: ',e);
            throw e;
        }
    }

    async getForms(project,options){
        options = options ? options : {};
        try{
            let offsetDays = options.offset ? offset : 30;
            let end = !options.end ? new Date() : options.end;
            let start = !options.start ? new Date() : options.start;
            start.setDate(start.getDate() - offsetDays);
            let dataNames = FormData.getDataNames();
            const documents = await this.db.collection('forms')
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
    
            return data;
        }
        catch(e){
            console.log('error getting forms: ',e);
            throw e;
        }
    }
}

let database = new DbInterface();

module.exports = {DbInterface,database};