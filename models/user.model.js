const bcrypt = require('bcrypt');
const mongodb = require('mongodb');
const db = require('../database/database');

class User {
    constructor(userInfo) {
        this.email = userInfo.email;
        this.password = userInfo.password;
        this.fullName = userInfo.fullname;
        this.addressData = {
            city: userInfo.city,
            street: userInfo.street,
            postalCode: userInfo.postcode,
        };
    }

    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDB().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            fullName: this.fullName,
            address: this.addressData,
        });
    }

    getCurrentInDB() {
        return db.getDB()
            .collection('users')
            .findOne({ email: this.email });
    }

    static findById(userId) {
        const userIdObject = new mongodb.ObjectId(userId);
        return db.getDB()
            .collection('users')
            .findOne({ _id: userIdObject }, { projection: { password: 0 } });
    }

    async doesExistAlready() {
        return await this.getCurrentInDB() !== null;
    }

    hasMatchingPasswords(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }

    isAddressValid() {
        return this.addressData.city.trim()
            && this.addressData.street.trim()
            && this.addressData.postalCode.trim();
    }

    areCredentialsValid() {
        return this.email && this.password
            && this.password.trim().length >= 8;
    }

    isDataValid() {
         return this.areCredentialsValid()
             && this.isAddressValid()
             && this.fullName.trim();
    }
}

module.exports = User;
