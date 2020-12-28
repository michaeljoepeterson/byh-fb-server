const {BaseData} = require('./base-data');

//model to represent the form field documents in the formfield collection
class FormFieldData extends BaseData{
    constructor(data){
        super(data);
        //handle 
        this.fieldTitle = null;
        this.fieldType = null;
        this.id = null;
        //if we need to connect a field in this case time to date
        this.associatedField = null;
        this.timezone = null;
        this.project = null;
        
        this.mapResponse(data);
    }
    //expected data is array of objects
    //changed to support easier dynamic fo rm creation
    mapResponse(formData){
        this.fieldTitle = formData.title;
        this.id = formData.id;
        this.fieldType = formData.type;
        this.timezone = formData.timezone;
    }
}

module.exports = {FormFieldData};