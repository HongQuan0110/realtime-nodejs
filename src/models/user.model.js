import mongoose from "mongoose";

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

module.exports = mongoose.model("user", UserSchema);
