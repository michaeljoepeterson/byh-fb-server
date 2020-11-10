class BaseData{
    constructor(data){

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
}

module.exports = {BaseData};