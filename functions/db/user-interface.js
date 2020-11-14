const admin = require('firebase-admin');
const FormData = require('../models/form-data');
const db = admin.firestore();

class UserInterface{
    constructor(){
        this.db = db;
    }

    async saveUser(user){
        try{
            
            return true;
        }
        catch(e){
            console.warn('error saving form: ',e);
            throw e;
        }
    }

    async getUsers(project,options){
        options = options ? options : {};
        try{

        }
        catch(e){
            console.log('error getting users: ',e);
            throw e;
        }
    }
}

let userDatabase = new UserInterface();

module.exports = {userDatabase};