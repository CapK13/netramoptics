const mongodb = require('mongodb').MongoClient;
var conn = null;
const dotenv = require("dotenv");
const { mongo } = require('mongoose');
dotenv.config();
mongodb.connect(process.env.MONGO_URI).then((db) => {
    conn = db.db("netramoptic");
}).catch((err) => {
    console.log("connection error");
});

module.exports = conn;
