import mongoose from "mongoose";

const Schema = mongoose.Schema;

let MessageSchema = new Schema({
    senderId: {type: String},
    receiverId: {type: String},
    conversationType: {type: String},
    messageType: {type: String},
    sender: {
        id: {type: String},
        name: {type: String},
        avatar: {type: String}
    },
    receiver: {
        id: {type: String},
        name: {type: String},
        avatar: {type: String}
    },
    text: { type: String },
    file: {data: Buffer, contentType: String, fileName: String},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
})

MessageSchema.statics = {
    /**
     * get limited message in personal one time
     * @param {string} senderId 
     * @param {string} receiverId id of contact
     * @param {number} limit 
     */
    getMessagesInPersonal(senderId, receiverId, limit) {
        return this.find({
            $or: [
                {$and: [
                    {senderId},
                    {receiverId},
                ]},
                {$and: [
                    {senderId: receiverId},
                    {receiverId: senderId},
                ]}
            ]
        }).sort({createdAt: -1}).limit(limit);
    },

    /**
     * get limited message in group
     * @param {string} receiverId id of group chat
     * @param {number} limit 
     */
    getMessagesInGroup(receiverId, limit) {
        return this.find({receiverId}).sort({createdAt: -1}).limit(limit);
    }
}

const MESSAGE_CONVERSATIONS = {
    PERSONAL: "personal",
    GROUP: "group"
}

const MESSAGE_TYPE = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file"
}

module.exports = {
    model: mongoose.model("message", MessageSchema),
    conversationTypes: MESSAGE_CONVERSATIONS,
    messageTypes: MESSAGE_TYPE
};
