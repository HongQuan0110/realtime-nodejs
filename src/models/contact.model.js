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
     * Find all contact that related with user then exclude to search
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
     * Remove contact
     * @param {string} userId 
     * @param {string} contactId 
     */
    removeContact(userId, contactId){
        return this.remove({
            $or: [
                {$and: [
                    {userId},
                    {contactId},
                    {status: true}
                ]},
                {$and: [
                    {userId: contactId},
                    {contactId: userId},
                    {status: true}
                ]}
            ]
        })
    },

    /**
     * Remove request contact sent
     * @param {string} userId 
     * @param {string} contactId 
     */
    removeRequestContactSent(userId, contactId){
        return this.remove({
            $and: [
                {userId},
                {contactId},
                {status: false}
            ]
        })
    },

    /**
     * Remove request contact received
     * @param {string} userId 
     * @param {string} contactId 
     */
    removeRequestContactReceived(userId, contactId){
        return this.remove({
            $and: [
                {userId: contactId},
                {contactId: userId},
                {status: false}
            ]
        })
    },

    /**
     * Approve request contact received
     * @param {string} userId 
     * @param {string} contactId 
     */
    approveRequestContactReceived(userId, contactId){
        return this.update({
            $and: [
                {userId: contactId},
                {contactId: userId},
                {status: false}
            ]
        }, {status: true, updatedAt: Date.now()})
    },

    /**
     * Get contacts by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
    getContacts(userId, limit){
        return this.find({
            $and: [
                {$or: [
                    {userId},
                    {contactId: userId}
                ]},
                {status: true}
            ]
        }).sort({updatedAt: -1}).limit(limit);
    },

    /**
     * Get contacts sent by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
    getContactsSent(userId, limit){
        return this.find({
            $and: [
                {userId},
                {status: false}
            ]
        }).sort({createdAt: -1}).limit(limit);
    },

    /**
     * Get contacts received by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
    getContactsReceived(userId, limit){
        return this.find({
            $and: [
                {contactId: userId},
                {status: false}
            ]
        }).sort({createdAt: -1}).limit(limit);
    },

    /**
     * Get count all contacts received by userId
     * @param {string} userId 
     */
    countAllContacts(userId){
        return this.count({
            $and: [
                {$or: [
                    {userId},
                    {contactId: userId}
                ]},
                {status: true}
            ]
        })
    },

    /**
     * Get count all contacts received by userId
     * @param {string} userId 
     */
    countAllContactsSent(userId){
        return this.count({
            $and: [
                {userId},
                {status: false}
            ]
        })
    },

    /**
     * Get count all contacts received by userId
     * @param {string} userId 
     */
    countAllContactsReceived(userId){
        return this.count({
            $and: [
                {contactId: userId},
                {status: false}
            ]
        })
    },

    readMoreContacts(userId, skip,limit) {
        return this.find({
            $and: [
                {$or: [
                    {userId},
                    {contactId: userId}
                ]},
                {status: true}
            ]
        }).sort({updatedAt: -1}).skip(skip).limit(limit);
    },

    readMoreContactsSent(userId, skip,limit) {
        return this.find({
            $and: [
                {userId},
                {status: false}
            ]
        }).sort({createdAt: -1}).skip(skip).limit(limit);
    },

    readMoreContactsReceived(userId, skip,limit) {
        return this.find({
            $and: [
                {contactId: userId},
                {status: false}
            ]
        }).sort({createdAt: -1}).skip(skip).limit(limit);
    }
}

module.exports = mongoose.model("contact", ContactSchema);
