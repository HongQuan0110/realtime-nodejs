import mongoose from "mongoose";

const Schema = mongoose.Schema;

let NotificationSchema = new Schema({
    senderId: {type: String},
    receiverId: {type: String},
    type: {type: String},
    isRead: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now}
})

NotificationSchema.statics = {
    createNew(item) {
        return this.create(item);
    },

    removeRequestNotification(senderId, receiverId, type){
        return this.remove({
            $or: [
                {
                    $and: [
                        {senderId},
                        {receiverId},
                        {type}
                    ]
                },
                {$and: [
                    {senderId: receiverId},
                    {receiverId: senderId},
                    {type}
                ]}
            ]
            
        })
    },

    /**
     * Get by UserId and limit
     * @param {string} userId 
     * @param {number} limit 
     */
    getByUserIdAndLimit(userId, limit){
        return this.find({
            receiverId: userId
        }).sort({createdAt: -1}).limit(limit)
    }
}

const NOTIFICATION_TYPE = {
    ADD_CONTACT: "add_contact"
}

const NOTIFICATION_CONTENTS = {
    getContent: (notificationType, isRead, userId, userName, userAvatar) => {
        if(NOTIFICATION_TYPE.ADD_CONTACT === notificationType){
            if(!isRead){
                return `<span class="notif-readed-false" data-uid="${ userId }">
                            <img class="avatar-small" src="/images/users/${userAvatar}" alt=""> 
                            <strong>${userName}</strong> đã chấp nhận lời mời kết bạn của bạn!
                        </span><br><br><br>`
            }
            return `<span data-uid="${ userId }">
                            <img class="avatar-small" src="/images/users/${userAvatar}" alt=""> 
                            <strong>${userName}</strong> đã chấp nhận lời mời kết bạn của bạn!
                        </span><br><br><br>`
        }
        return "No matching with any notification type";
    }
}

module.exports = {
    types: NOTIFICATION_TYPE,
    contents: NOTIFICATION_CONTENTS,
    model: mongoose.model("notification", NotificationSchema)
}
