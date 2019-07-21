import mongoose from "mongoose";

const Schema = mongoose.Schema;

let NotificationSchema = new Schema({
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
    type: {type: String},
    content: {type: String},
    isRead: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now}
})

module.exports = mongoose.model("notification", NotificationSchema);