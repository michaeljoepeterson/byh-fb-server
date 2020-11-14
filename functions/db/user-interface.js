const admin = require('firebase-admin');
const {User} = require('../models/user');
const {BaseInterface} = require('./base-interface');
const db = admin.firestore();

class UserInterface extends BaseInterface{
    constructor(){
        super();
        this.db = db;
        this.userCollection = 'users';
        this.userId = 'email';
        this.levelCollection = 'user_levels';
        this.levelN
    }

    async saveUser(userData){
        try{
            let user = new User(userData);
            let saveData = user.serialize();
            let id = saveData.email;
            console.log('user save data:',saveData);
            await this.db.collection(this.userCollection).doc(id).set(saveData);

            return true;
        }
        catch(e){
            console.warn('error saving form: ',e);
            throw e;
        }
    }

    async getUser(project,email){
        try{
            let users = await this.db.collection(this.userCollection)
            .where(this.projectId,'array-contains',project)
            .where(this.userId,'==',email).get();

            let data = []
            users.forEach(doc => {
                data.push(doc.data());
            });
            if(data.length > 1){
                throw {
                    message:'More than one user found'
                };
            }
            else if(data.length === 0){
                return null;
            }
            else{
                let level = await this.db.collection(this.levelCollection).doc(data[0].level).get();
                let levelData = level.data();
                data[0].level = levelData;
                return data[0];
            }

        }
        catch(e){
            console.log('error getting users: ',e);
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