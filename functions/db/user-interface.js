const admin = require('firebase-admin');
const {User} = require('../models/user');
const db = admin.firestore();

class UserInterface{
    constructor(){
        this.db = db;
    }

    async saveUser(userData){
        try{
            let user = new User(userData);
            let saveData = user.serialize();
            let id = saveData.email;
            console.log('user save data:',saveData);
            await this.db.collection('users').doc(id).set(saveData);

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