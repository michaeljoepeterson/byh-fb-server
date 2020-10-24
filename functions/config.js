exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 8080;
exports.DOMAINS = process.env.DOMAINS;
exports.SECRET = process.env.SECRET;

const admin = require('firebase-admin');
const serviceAccount = require('./admin.json');

exports.fb = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://byh-app.firebaseio.com"
});