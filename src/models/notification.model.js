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

    removeRequestContactSentNotification(senderId, receiverId, type){
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
    },

    /**
     * Count all notification unread
     * @param {string} userId 
     */
    countNotifUnread(userId){
        return this.count({
            $and: [
                {receiverId: userId},
                {isRead: false}
            ]
        })
    },

    /**
     * Read more notification
     * @param {string} userId 
     * @param {number} skipNumber 
     * @param {number} limit 
     */
    readMore(userId, skipNumber, limit){
        return this.find({receiverId: userId}).sort({createdAt: -1}).skip(skipNumber).limit(limit);
    },

    /**
     * Mark notification as read
     * @param {string} userId 
     * @param {array} targetUsers 
     */
    markAllAsRead(userId, targetUsers){
        return this.updateMany({
            $and: [
                {receiverId: userId},
                {senderId: {$in: targetUsers}}
            ]
        }, {isRead: true});
    }
}

const NOTIFICATION_TYPE = {
    ADD_CONTACT: "add_contact"
}

const NOTIFICATION_CONTENTS = {
    getContent: (notificationType, isRead, userId, userName, userAvatar) => {
        if(NOTIFICATION_TYPE.ADD_CONTACT === notificationType){
            if(!isRead){
                return `<div class="notif-readed-false" data-uid="${ userId }">
                            <img class="avatar-small" src="/images/users/${userAvatar}" alt=""> 
                            <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                        </div>`;
            }
            return `<div data-uid="${ userId }">
                            <img class="avatar-small" src="/images/users/${userAvatar}" alt=""> 
                            <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                        </div>`;
        }
        return "No matching with any notification type";
    }
}

module.exports = {
    types: NOTIFICATION_TYPE,
    contents: NOTIFICATION_CONTENTS,
    model: mongoose.model("notification", NotificationSchema)
}
