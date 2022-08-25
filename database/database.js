const mongodb = require('mongodb');
const {mongoDBConnString, databaseName} = require("../config/config");

class MongoDBConnectionError extends Error {
    constructor(message) {
        super(message);
        this.name = "MongoDBConnectionError";
    }
}

let database;

async function connectToDatabase() {
    const client = await mongodb
        .MongoClient
        .connect(mongoDBConnString);
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
