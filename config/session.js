const session = require('express-session');
const {databaseName, mongoDBConnString} = require("./config");
const mongoDBStore = require('connect-mongodb-session');

function createSessionStore() {
    const MongoDBStore = mongoDBStore(session);

    return new MongoDBStore({
        uri: mongoDBConnString,
        databaseName: databaseName,
        collection: 'sessions',
    });
}

function createSessionConfig() {

    return {
        secret: 'rhoydz2la5i',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 6e4,
            sameSite: 'lax',
        },
    };
}

module.exports = createSessionConfig;
