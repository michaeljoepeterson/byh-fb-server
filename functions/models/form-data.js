const {BaseData} = require('./base-data');
const {FormResponse} = require('./form-response');
const NodeCache = require( "node-cache" );
//reset cache every 10 min for now
//prod change to 60
let timeOutDefault = (60) * 10;
let checkPeriod = (60) * 15;
//cache to avoid uneccssary db checks/writes
const fieldDataCache = new NodeCache({ stdTTL: timeOutDefault, checkperiod: checkPeriod });
//because of nodejs version 10 we have to initialize vars in constructor

//possible todo add dynamic field creation in case fields are added to form
class FormData extends BaseData{
    /*
    new form data: 
    {
        value,
        type -> saved on form result just in case type changes at some point
    }
    */
    constructor(data,project){
        super(data);
        this.referralNum = null;
        this.referralType = null;
        this.otherReferralType = null;
        this.schoolDistrict = null;
        this.referralDate = null;
        this.contactTime = null;
        this.referralPer = null;
        this.referralTypeAndName = null;
        this.clientLocation = null;
        this.locationNeighbourhood = null;
        this.country = null;
        this.firstName = null;
        this.age = null;
        this.learnedAbout = null;
        this.project = project ? project : null;
        this.id = null;
        this.idIdentifier = 'referral #';
        this.projectIdentifier = 'project';
        this.customFields = {};

        this.dynamicMapData(data);
    }

    static getDataNames(){
        let dataNames = {
            referralNum: 'referralNum' ,
            referralType: 'referralType' ,
            otherReferralType: 'otherReferralType' ,
            schoolDistrict: 'schoolDistrict' ,
            referralDate: 'referralDate' ,
            contactTime: 'contactTime' ,
            referralPer: 'referralPer' ,
            referralTypeAndName: 'referralTypeAndName' ,
            clientLocation: 'clientLocation' ,
            locationNeighbourhood: 'locationNeighbourhood' ,
            country: 'country' ,
            firstName: 'firstName' ,
            age: 'age' ,
            learnedAbout: 'learnedAbout' ,
            project: 'project'
        }; 

        return dataNames;
    }
    
    dynamicMapData(data){
        data.forEach(formField => {
            let formResp = new FormResponse(formField);
            /*
            this.customFields[formResp.id] = {
                value:formResp.value,
                type:this.getFieldType(formResp)
            };
            */
            if(formResp.title.toLowerCase().includes(this.projectIdentifier)){
                this.project = formResp.value;
            }
            else{
                this.customFields[formResp.id + `-${this.project}`] = formResp.value;
            }
            if(formResp.title.toLowerCase().includes(this.idIdentifier)){
                this.id = formResp.value;
            }
        });
    }

    mapData(data){
        const numberType = 'number';
        const stringType = 'string';
        const dateType = 'date';
        const timeType = 'time';
        //ids from google form
        const dataMap = {
            '449303681':{
                classKey:'referralNum',
                type:numberType
            },
            '496416008':{
                classKey:'referralType',
                type:stringType
            },
            '238537915':{
                classKey:'otherReferralType',
                type:stringType 
            },
            '1762050626':{
                classKey:'schoolDistrict',
                type:stringType 
            },
            '1313658934':{
                classKey:'referralDate',
                type:dateType 
            },
            '1532216742':{
                classKey:'contactTime',
                type:timeType 
            },
            '1677961388':{
                classKey:'referralPer',
                type:stringType 
            },
            '537383970':{
                classKey:'referralTypeAndName',
                type:stringType 
            },
            '152041769':{
                classKey:'clientLocation',
                type:stringType 
            },
            '1553411245':{
                classKey:'locationNeighbourhood',
                type:stringType 
            },
            '1717973430':{
                classKey:'country',
                type:stringType 
            },
            '1610778761':{
                classKey:'firstName',
                type:stringType 
            },
            '57428050':{
                classKey:'age',
                type:numberType 
            },
            '757950175':{
                classKey:'learnedAbout',
                type:stringType 
            },
            'project':{
                classKey:'project',
                type:stringType 
            }
        };

        for(let key in data){
            try{
                if(dataMap[key]){
                    let {type,classKey} = dataMap[key];
                    if(type === stringType){
                        this[classKey] = data[key];
                    }
                    else if(type === numberType){
                        this[classKey] = Number(data[key]);
                    }
                    else if(type == dateType){
                        this[classKey] = new Date(data[key]);
                    }
                }
            }
            catch(e){
                console.warn('error mapping data',e);
                throw(e);
            }
        }
    }

    serialize(){
        this.customFields.id = this.id;
        this.customFields.project = this.project;
        return this.customFields;
    }
}

module.exports = FormData;