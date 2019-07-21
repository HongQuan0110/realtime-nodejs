import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
    name: {type: String},
    userAmount: {type: Number, min: 3},
    messagesAmount: {type: Number, default: 0},
    userId: {type: String},
    members: [
        {userId: {type: String}}
    ],
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
})

module.exports = mongoose.model("chat-group", ChatGroupSchema);