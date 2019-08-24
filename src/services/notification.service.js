import NotificationModal from "../models/notification.model";
import UserModal from "../models/user.model";

/**
 * Get notification when f5 page
 * Just 10 item one time
 * @param {string} userId 
 * @param {number} limit 
 */
let getNotifications = async (userId, limit = 10) => {
    try {
        let notifications = await NotificationModal.model.getByUserIdAndLimit(userId, limit);
        let getNotifyContents = notifications.map(async notification => {
            let sender = await UserModal.findUserById(notification.senderId);
            return NotificationModal.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
        })
        return await Promise.all(getNotifyContents);
    } catch (error) {
        console.log('notify', error);
    }
}

/**
 * Count all notification unread
 * @param {string} userId 
 */
let countNotifUnread = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notificationsUnread = await NotificationModal.model.countNotifUnread(userId);
            resolve(notificationsUnread);
        } catch (error) {
            console.log('notif', error);
            reject(error);
        }
    })
}

module.exports = {
    getNotifications,
    countNotifUnread
}
