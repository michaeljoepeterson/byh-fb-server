const admin = require('firebase-admin');
const FormData = require('../models/form-data');
const {FormFieldData} = require('../models/form-field-data');
const {FormResponse} = require('../models/form-response');
const {BaseInterface} = require('./base-interface');
const db = admin.firestore();
const NodeCache = require( "node-cache" );
//reset cache every 10 min for now
//prod change to 60
let timeOutDefault = (60) * 10;
let checkPeriod = (60) * 15;
//cache to avoid uneccssary db checks/writes
const fieldDataCache = new NodeCache({ stdTTL: timeOutDefault, checkperiod: checkPeriod });

class DbInterface extends BaseInterface{
    constructor(){
        super();
        this.db = db;
        this.timeIdentifier = 'time';
        this.dateIdentifier = 'date';
    }

    async saveForm(form){
        try{
            await this.createFields(form);
            
            let formData = new FormData(form);
            let saveData = formData.serialize();
            console.log('==========form instance: ',saveData);
            let id = String(saveData.id);
            if(id && saveData.id){
                await this.db.collection('forms').doc(id).set(saveData);
            }
            
            return true;
        }
        catch(e){
            console.warn('error saving form: ',e);
            throw e;
        }
    }

    async saveField(field){
        try{
            let saveData = field.serialize();
            console.log('==========field instance: ',saveData);
            let id = String(saveData.id);
            await this.db.collection('fields').doc(id).set(saveData);
            
            return true;
        }
        catch(e){
            console.warn('error saving form: ',e);
            throw e;
        }
    }

    getFieldType(respForm){

        let {value} = respForm;

        if(respForm.title.toLowerCase().includes(this.dateIdentifier)){
            return this.dateIdentifier;
        }
        if(respForm.title.toLowerCase().includes(this.timeIdentifier)){
            return this.timeIdentifier;
        }
        if(value){
            if(value instanceof Date){
                return 'date';
            }

            return typeof value;
        }

        return null;
    }

    async createFields(formData){
        //for associating date time fields
        let dateTimeMap = {};
        try{
            let fieldReqs = [];
            formData.forEach(async(form) => {
                try{
                    let respField = new FormFieldData(form);
                    let respForm = new FormResponse(form);
                    let type = respField.getFieldType(respForm);
                    respField.fieldType = type;
                    //console.log('resp field======',respForm);
                    let existingField = fieldDataCache.get(respField.id);
                    //one way association only one of the fields will have the association
                    //which should be enough to setup a relation ship
                    if(type === this.timeIdentifier || type === this.dateIdentifier){
                        let isDate = type === this.dateIdentifier;
                        let dateIdSplit = !isDate ? respField.fieldTitle.toLowerCase().split(this.timeIdentifier) : respField.fieldTitle.toLowerCase().split(this.dateIdentifier);
                        let dateId = dateIdSplit.find(str => str !== '');
                        if(!dateTimeMap[dateId]){
                            let dateObj = {
                                date:null,
                                time:null
                            };
                            dateObj.date = type === this.dateIdentifier ? respField.id : null;
                            dateObj.time = type === this.timeIdentifier ? respField.id : null;
                            dateTimeMap[dateId] = dateObj;
                        }
                        else{
                            if(isDate){
                                respField.associatedField = dateTimeMap[dateId].time;
                            }
                            else{
                                respField.associatedField = dateTimeMap[dateId].date;
                            }
                        }
 
                    }
                    //console.log('date: ',dateTimeMap);
                    //console.log('final resp field: ',respField);
                    //create/update field if it does not exist
                    if(!existingField){
                        //await this.saveField(respField); 
                        fieldReqs.push(this.saveField(respField));
                        fieldDataCache.set(respField.id,respField);
                    }
                }
                catch(e){
                    throw e;
                }
            });
            if(fieldReqs.length > 0){
                await Promise.all(fieldReqs);
            }
        }
        catch(e){
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

let formDatabase = new DbInterface();

module.exports = {DbInterface,formDatabase};