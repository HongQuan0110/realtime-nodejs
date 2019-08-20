import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userId: {type: String},
    contactId: {type: String},
    status: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
})

ContactSchema.statics = {
    createNew(item) {
        return this.create(item);
    },

    /**
     * Find all contact that related with user
     * @param {string} userId
     */
    findAllById(userId){
        return this.find({
            $or: [
                {userId: userId},
                {contactId: userId}
            ]
        })
    },

    /**
     * Check exist of 2 users
     * @param {string} userId 
     * @param {string} contactId 
     */
    checkExist(userId, contactId){
        return this.findOne({
            $or: [
                {$and: [
                    {userId},
                    {contactId}
                ]},
                {$and: [
                    {userId: contactId},
                    {contactId: userId}
                ]}
            ]
        })
    },

    /**
     * Remove request contact
     * @param {string} userId 
     * @param {string} contactId 
     */
    removeRequestContact(userId, contactId){
        return this.remove({
            $or: [
                {$and: [
                    {userId},
                    {contactId}
                ]},
                {$and: [
                    {userId: contactId},
                    {contactId: userId}
                ]}
            ]
        })
    }
}

module.exports = mongoose.model("contact", ContactSchema);
