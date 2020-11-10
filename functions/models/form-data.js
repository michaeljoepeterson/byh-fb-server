const {BaseData} = require('./base-data');
//because of nodejs version 10 we have to initialize vars in constructor

//possible todo add dynamic field creation in case fields are added to form
class FormData extends BaseData{

    constructor(data){
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
            }
        };

        for(let key in data){
            if(this.mapData[key]){
                let {type,classKey} = dataMap[key];
                if(type === stringType){
  
                }
                else if(type === numberType){

                }
                else if(type == dateType){

                }
                else if(type == timeType){

                }
            }
        }
    }

    serialize(){
        console.log(Object.keys(this));
    }
}

module.exports = FormData;