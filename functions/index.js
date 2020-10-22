const functions = require('firebase-functions');
require('dotenv').config();
const express = require('express');
const {PORT, DATABASE_URL,DOMAINS } = require('./config');
const {router: mainRouter} = require('./routers/main-router.js');
const {cors} = require('./tools/toolsLib');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = express();

const admin = require('firebase-admin');
const serviceAccount = require('./admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://byh-app.firebaseio.com"
});

app.use(jsonParser);
app.use(cors);
app.use('/api',mainRouter);
//generic error handler
app.use((req,res,next) => {
    res.status(500);
    let err = res.err ? res.err : 'no error provided';
    console.log('error: ',err);
    return res.json({
        message:'An error occured',
        error:err
    })
});
/*
async function runServer(port = PORT){
    try{
        let server = app.listen(port,() => {
            console.log('app listeneing on port ' + port);
        });

        return true;
    }
    catch(err){
        return false;
    }
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
            return reject(err);
            }
            resolve();
        });
    });
}

runServer(DATABASE_URL).catch(err => console.error(err));
*/
//module.exports = { app: functions.https.onRequest(app), runServer, closeServer };

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
