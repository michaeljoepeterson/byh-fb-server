class BaseData{
    constructor(data){
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
    //base map data to object
    mapData(data){
        let props = Object.getOwnPropertyNames(this);
        props.forEach(prop => {
            if(data[prop] || data[prop] === 0){
                this[prop] = data[prop];
            }
        });
    }

    serialize(){
        let props = Object.getOwnPropertyNames(this);
        let data = {};
        
        props.forEach(prop => {
            if(this[prop] || this[prop] === 0){
                data[prop] = this[prop];
            }
        });

        return data;
    }
}

module.exports = {BaseData};