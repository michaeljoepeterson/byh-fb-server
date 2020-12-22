class BaseData{
    constructor(data){
        this.timeIdentifier = 'time';
        this.dateIdentifier = 'date';
        //this.data = data;
    }
    /**
     * Clean a string optionally with provided illegal chars
     * 
     */
    cleanString (string,illegalChars){
        let baseIllegalChars = '<>()+';
        let regex = null;
        let cleanedString = '';
        if(typeof illegalChars === 'string'){

        }
        else if(Array.isArray(illegalChars)){

        }

        regex = new RegExp(`[${baseIllegalChars}]`);
        return cleanedString.replace(regex,'');
    }
    //base get names
    getDataNames(){
        let names = {}
        let props = Object.getOwnPropertyNames(this);
        props.forEach(key => {
            names[key] = key;
        });

        return names;
    }
    //base map data to class/object
    mapData(data){
        let props = Object.getOwnPropertyNames(this);
        
        props.forEach(prop => {
            if(data[prop] || data[prop] === 0){
                this[prop] = data[prop];
            }
        });
    }
    //base serialize to simple object
    serialize(){
        let props = Object.getOwnPropertyNames(this);
        let data = {};
        const timeString = 'timeIdentifier';
        const dateString = 'dateIdentifier';
        const ignoreFields = [timeString,dateString];
        props = props.filter(prop => !ignoreFields.includes(prop));
        props.forEach(prop => {
            if(this[prop] || this[prop] === 0){
                data[prop] = this[prop];
            }
        });

        return data;
    }

    getFieldType(respForm){

        let {value} = respForm;
        //to sync time and date format must be 
        //some name date
        //some name time
        let regexDate = /[\s]{1}date[\s\W]{0,1}/gi;
        let regexTime = /[\s]{1}time[\s\W]{0,1}/gi;
        if(respForm.title.toLowerCase().match(regexDate)){
            return this.dateIdentifier;
        }
        if(respForm.title.toLowerCase().match(regexTime)){
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
}

module.exports = {BaseData};