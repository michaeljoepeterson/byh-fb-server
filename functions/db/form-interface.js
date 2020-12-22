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
            let modifiedForms = await this.createFields(form);
            
            let formData = new FormData(modifiedForms);
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

    async createFields(formData){
        //for associating date time fields
        let dateTimeMap = {};
        try{
            let fieldReqs = [];
            let finalForms = [];
            formData.forEach(async(form,index) => {
                try{
                    let respField = new FormFieldData(form);
                    let respForm = new FormResponse(form);
                    let type = respField.getFieldType(respForm);
                    respField.fieldType = type;
                    //console.log('resp field======',respForm);
                    let existingField = fieldDataCache.get(respField.id);
                    //one way association only one of the fields will have the association
                    //which should be enough to setup a relationship
                    if(type === this.dateIdentifier){
                        respForm.value = new Date(respForm.value);
                    }
                    if(type === this.timeIdentifier || type === this.dateIdentifier){
                        let isDate = type === this.dateIdentifier;
                        let dateIdSplit = !isDate ? respField.fieldTitle.toLowerCase().split(this.timeIdentifier) : respField.fieldTitle.toLowerCase().split(this.dateIdentifier);
                        let dateId = dateIdSplit.find(str => str !== '');
                        if(!dateTimeMap[dateId]){
                            let dateObj = {
                                date:null,
                                time:null,
                                dateIndex:null,
                                timeIndex:null
                            };
                            dateObj.date = type === this.dateIdentifier ? respField.id : null;
                            dateObj.time = type === this.timeIdentifier ? respField.id : null;

                            dateObj.dateIndex = type === this.dateIdentifier ? index : null;
                            dateObj.timeIndex = type === this.timeIdentifier ? index : null;
                            
                            dateTimeMap[dateId] = dateObj;
                        }
                        else{
                            if(isDate){
                                let timeIndex = dateTimeMap[dateId].timeIndex;
                                respField.associatedField = dateTimeMap[dateId].time;
                                if(timeIndex){
                                    try{
                                        let timeSplit = finalForms[timeIndex].split(":");
                                        respForm.value.setHours(timeSplit[0],timeSplit[1]);
                                    }
                                    catch(e){
                                        console.log('error saving time to date',e);
                                    }
                                }
                            }
                            else{
                                let dateIndex = dateTimeMap[dateId].dateIndex;
                                respField.associatedField = dateTimeMap[dateId].date;
                                if(dateIndex){
                                    try{
                                        let timeSplit = respForm.value.split(':');
                                        finalForms[dateIndex].value.setHours(timeSplit[0],timeSplit[1]);
                                    }
                                    catch(e){
                                        console.log('error saving date to time',e);
                                    }
                                }
                            }
                        }
 
                    }
                    //console.log('date: ',dateTimeMap);
                    console.log('final resp form: ',respForm);
                    //create/update field if it does not exist
                    if(!existingField){
                        //await this.saveField(respField); 
                        fieldReqs.push(this.saveField(respField));
                        fieldDataCache.set(respField.id,respField);
                    }
                    finalForms.push(respForm);
                }
                catch(e){
                    throw e;
                }
            });
            if(fieldReqs.length > 0){
                await Promise.all(fieldReqs);
                return finalForms;
            }

            return [];
        }
        catch(e){
            throw e;
        }
    }

    async populateFields(){

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