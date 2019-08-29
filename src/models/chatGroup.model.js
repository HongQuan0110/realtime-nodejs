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
    updatedAt: {type: Number, default: Date.now},
    deletedAt: {type: Number, default: null}
})

ChatGroupSchema.statics = {
    /**
     * get chat group items by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
    getChatGroups(userId, limit){
        return this.find({
            members: {$elemMatch: {userId: userId}}
        }).sort({updatedAt: -1}).limit(limit);
    }
}

module.exports = mongoose.model("chat-group", ChatGroupSchema);
