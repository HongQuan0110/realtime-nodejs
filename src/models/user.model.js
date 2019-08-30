import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {type: String},
    gender: {type: String, default: "male"},
    phone: {type: String, default: null},
    address: {type: String, default: null},
    avatar: {type: String, default: "avatar-default.jpg"},
    role: {type: String, default: "user"},
    local: {
        email: {type: String, trim: true},
        password: {type: String},
        isActive: {type: Boolean, default: false},
        verifyToken: {type: String}
    },
    facebook:{
        uid: {type: String},
        token: {type: String},
        email: {type: String, trim: true},
    },
    google:{
        uid: {type: String},
        token: {type: String},
        email: {type: String, trim: true},
    },
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
})

UserSchema.statics = {
    createNew(item){
        return this.create(item);
    },

    findByEmail(email){
        return this.findOne({"local.email": email}).exec();
    },

    removeUserById(id){
        return this.findByIdAndRemove(id).exec();
    },

    findUserByToken(token){
        return this.findOne({"local.verifyToken": token});
    },

    verifyToken(token){
        return this.findOneAndUpdate({"local.verifyToken": token}, {"local.isActive": true});
    },

    findUserByIdToUpdatePassword(id){
        return this.findById(id).exec();
    },

    findUserByIdForSessionToUse(id){
        return this.findById(id, {"local.password": 0}).exec();
    },

    findUserByFacebookUid(uid){
        return this.findOne({"facebook.uid": uid}).exec();
    },

    findUserByGoogleUid(uid){
        return this.findOne({"google.uid": uid}).exec();
    },
    
    updateUserById(id, item){
        return this.findByIdAndUpdate(id, item); // Return old data before update
    },

    updatePasswordById(id, hashedPassword){
        return this.findByIdAndUpdate(id, {"local.password": hashedPassword});
    },

    /**
     * Find all users for add contact
     * @param {array} deprecatedUserIds 
     * @param {string} keyword 
     */
    findAllForAddContact(deprecatedUserIds, keyword){
        return this.find({
            $and: [
                {_id: {$nin: deprecatedUserIds}},
                {"local.isActive": true},
                {$or: [
                    {username: {$regex: new RegExp(keyword, "i")}},
                    {"local.email": {$regex: new RegExp(keyword, "i")}},
                    {"facebook.email": {$regex: new RegExp(keyword, "i")}},
                    {"google.email": {$regex: new RegExp(keyword, "i")}}
                ]}
            ]
        },"_id username address avatar" )
    },

    getNormalUserDataById(id){
        return this.findById(id, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
    },
}

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password, this.local.password);
    }
}

module.exports = mongoose.model("user", UserSchema);
