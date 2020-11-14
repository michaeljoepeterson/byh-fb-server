const {BaseData} = require('./base-data');

class User extends BaseData{

    constructor(data){
        super(data);
        this.firstName = null;
        this.lastName = null;
        this.level = null;
        this.email = null;
        this.project = null;

        if(data){
            this.mapData(data);
        }
    }    
}

module.exports = {User};