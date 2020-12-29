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
//date.toLocaleString("en-US", {timeZone: "America/Denver", timeZoneName: "long"})
//need to parse that client side only way to handle timezone since google scripts are dumb
class DbInterface extends BaseInterface{
    constructor(){
        super();
        this.db = db;
        this.timeIdentifier = 'time';
        this.dateIdentifier = 'date';
        this.projectIdentifier = 'project';
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

    async saveField(field,project){
        try{
            field.project = project;
            let saveData = field.serialize();
            console.log('==========field instance: ',saveData);
            let id = String(saveData.id);
            if(id && saveData.id){
                console.log(saveData.id);
                await this.db.collection('fields').doc(id).set(saveData);
            }
            
            return true;
        }
        catch(e){
            console.warn('error saving field: ',e);
            throw e;
        }
    }

    async createFields(formData){
        //for associating date time fields
        let dateTimeMap = {};
        let projectField = formData.find(data => data.title.toLowerCase() === 'project');
        let project = projectField.value;
        console.log('==========form data: ',formData);
        try{
            let fieldReqs = [];
            let finalForms = [];
            formData.forEach(async(form,index) => {
                try{
                    let respField = new FormFieldData(form);
                    let respForm = new FormResponse(form);
                    let type = respField.getFieldType(respForm);
                    respField.fieldType = type;

                    let existingField = respField.id ? fieldDataCache.get(respField.id): null;
                    //one way association only one of the fields will have the association
                    //which should be enough to setup a relationship
                    if(type === this.dateIdentifier){
                        respForm.value = new Date(respForm.value);
                    }
                    /*
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
                    */
                    //console.log('date: ',dateTimeMap);
                    //console.log('final resp form: ',respForm);
                    //create/update field if it does not exist
                    if(!existingField && respField.id){
                        //await this.saveField(respField); 
                        fieldReqs.push(this.saveField(respField,project));
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

            return finalForms;
        }
        catch(e){
            throw e;
        }
    }

    async getField(title){
        try{
            const documents = await this.db.collection('fields')
            .where('fieldTitle','==',title).get();
            let field = null;
            documents.forEach(doc => {
                field = doc.data();
            })
            return field;
        }
        catch(e){
            console.log('error getting field: ',e);
            throw e;
        }
    }

    async getFieldById(id){
        try{
            const doc = await this.db.collection('fields').doc(id).get();
            let field = doc.data();
            return field;
        }
        catch(e){
            console.log('error getting field: ',e);
            throw e;
        }
    }

    async getProjectFields(project){
        try{
            const documents = await this.db.collection('fields').where('project','==',project).get();
            let fields = [];
            documents.forEach(doc => {
                let field = doc.data();
                fields.push(field);
            })
            return fields;
        }
        catch(e){
            console.log('error getting field: ',e);
            throw e;
        }
    }

    async populateFields(forms){
        try{
            let fieldReqs = [];
            let fieldsAdded = {};
            let formFields = [];
            let populatedDocs = [];
            forms.forEach(form => {
                for(let fieldId in form){
                    let cachedField = fieldDataCache.get(fieldId);
                    if(!cachedField && !fieldsAdded[fieldId]){
                        fieldReqs.push(this.getFieldById(fieldId));
                        fieldsAdded[fieldId] = fieldReqs.length - 1;
                    }
                    else if(cachedField && !fieldsAdded[fieldId]){
                        fieldReqs.push(cachedField);
                        fieldsAdded[fieldId] = fieldReqs.length - 1;
                    }   
                }
            });

            let fields = await Promise.all(fieldReqs);

            forms.forEach(form => {
                formFields = [];
                for(let fieldId in form){
                    let cachedField = fieldDataCache.get(fieldId);
                    let foundField = fields[fieldsAdded[fieldId]];
                    if(foundField){
                        let formResp = new FormResponse();
                        formResp.title = foundField.fieldTitle;
                        formResp.id = foundField.id;
                        formResp.type = foundField.fieldType;
                        formResp.value = form[fieldId];
                        if(!cachedField){
                            fieldDataCache.set(fieldId,foundField);
                        }
                        formFields.push(formResp.serialize());
                        
                    }
                }
                let formData = {
                    id:form.id,
                    fields:formFields
                };
                populatedDocs.push(formData);
            });
            console.log('pop docs: ',populatedDocs);
            return populatedDocs;
        }
        catch(e){
            console.log('error populating fields: ',e);
            throw e;
        }
    }

    async getForms(project,options){
        options = options ? options : {};
        try{
            let offsetDays = options.offset ? offset : 30;
            let end = !options.end ? new Date() : options.end;
            let start = !options.start ? new Date() : options.start;
            let {dateField} = options; 
            let dateFieldData = dateField ? await this.getField(dateField) : null;
            start.setDate(start.getDate() - offsetDays);
            //let dataNames = FormData.getDataNames();
            let documents = [];
            if(dateField){
                console.log(dateFieldData);
                console.log(start,end,project);
                documents = await this.db.collection('forms')
                .where('project', '==',project)
                .where(String(dateFieldData.id),'>',start)
                .where(String(dateFieldData.id),'<',end).get()
                ;
            }
            else{
                documents = await this.db.collection('forms')
                .where('project', '==',project).get()
            }
            console.log('retrieved forms========');
            const data = [];
            documents.forEach(doc =>{
                let docData = doc.data();
                /*
                if(docData.referralDate){
                    docData.referralDate = docData.referralDate.toDate();
                }
                */
                if(dateFieldData && docData[dateFieldData.id]){
                    docData[dateFieldData.id] = docData[dateFieldData.id].toDate();
                }
                data.push(docData);
            });
            console.log(data);
            let populatedDocs = await this.populateFields(data);
            return populatedDocs;
        }
        catch(e){
            console.log('error getting forms: ',e);
            throw e;
        }
    }
}

let formDatabase = new DbInterface();

module.exports = {DbInterface,formDatabase};