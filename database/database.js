const mongodb = require('mongodb');
const {mongoDBConnString, databaseName} = require("../config/config");
const {MongoClient, ServerApiVersion} = require("mongodb");

class MongoDBConnectionError extends Error {
    constructor(message) {
        super(message);
        this.name = "MongoDBConnectionError";
    }
}

let database;

async function connectToDatabase() {
    const client = new MongoClient(
        process.env.MONGODB_URI || mongoDBConnString,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect((error) => console.log(error));
    database = client.db(databaseName);
}

function getDB() {
    if (!database)
        throw new MongoDBConnectionError('You must connect first!');
    return database;
}

module.exports = {
    getDB: getDB,
    connectToDatabase: connectToDatabase,
}
