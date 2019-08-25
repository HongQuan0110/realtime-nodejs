import NotificationModal from "../models/notification.model";
import UserModal from "../models/user.model";

const LIMIT_NUMBER_TAKEN = 1;

/**
 * Get notification when f5 page
 * Just 10 item one time
 * @param {string} userId 
 */
let getNotifications = async (userId) => {
    try {
        let notifications = await NotificationModal.model.getByUserIdAndLimit(userId, LIMIT_NUMBER_TAKEN);
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

/**
 * Read more notification, max 10 item one time
 * @param {string} userId 
 * @param {number} skipNumber 
 */
let readMore = (userId, skipNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotification = await NotificationModal.model.readMore(userId, skipNumber, LIMIT_NUMBER_TAKEN);
            let getNotifyContents = newNotification.map(async notification => {
                let sender = await UserModal.findUserById(notification.senderId);
                return NotificationModal.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            return resolve(Promise.all(getNotifyContents));
        } catch (error) {
            console.log("notification service", error);
            reject(false);
        }
    })
}

/**
 * Mark notification as read
 * @param {string} userId 
 * @param {array} targetUsers 
 */
let markAllAsRead = (userId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
        try {
            await NotificationModal.model.markAllAsRead(userId, targetUsers);
            resolve(true);
        } catch (error) {
            console.log("Error when mark notification as read:", error);
            reject(false);
        }
    })
}

module.exports = {
    getNotifications,
    countNotifUnread,
    readMore,
    markAllAsRead
}
