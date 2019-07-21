import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userId: {type: String},
    contactId: {type: String},
    status: {type: Boolean, default: false},
    username: {type: String},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
})

module.exports = mongoose.model("contact", ContactSchema);