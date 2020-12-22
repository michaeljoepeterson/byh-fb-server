const {BaseData} = require('./base-data');
//model to represent the form response from google forms
//only added to make it clear what the data should look like
class FormResponse extends BaseData{
    constructor(data){
        super(data);
        this.title= null;
        this.value = null;
        this.id = null;
        this.type = null;
        if(data){
            this.mapData(data);
        }
    }

}

module.exports = {FormResponse};