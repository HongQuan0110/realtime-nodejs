import mongoose from "mongoose";

const Schema = mongoose.Schema;

let MessageSchema = new Schema({
    sender: {
        id: {type: String},
        username: {type: String},
        avartar: {type: String}
    },
    receiver: {
        id: {type: String},
        username: {type: String},
        avartar: {type: String}
    },
    text: { type: String },
    file: {data: Buffer, contentType: String, fileName: String},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
})

module.exports = mongoose.model("message", MessageSchema);
