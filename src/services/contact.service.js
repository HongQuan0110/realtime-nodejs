import _ from "lodash";

import ContactModal from "../models/contact.model";
import UserModal from "../models/user.model";
import NotificationModal from "../models/notification.model";

let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecatedUserIds = [currentUserId];
        let contactsByUser = await ContactModal.findAllById(currentUserId);
        contactsByUser.map(contact => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        })

        deprecatedUserIds = _.uniqBy(deprecatedUserIds);
        let users = await UserModal.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);
    })
}

let addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModal.checkExist(currentUserId, contactId);
        if(contactExists){
            return reject(false);
        }
        // create contact
        let contactItem = {
            userId: currentUserId,
            contactId,
        }
        let newContact = await ContactModal.createNew(contactItem);

        // notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModal.types.ADD_CONTACT
        }

        await NotificationModal.model.createNew(notificationItem);

        resolve(newContact);
    })
}

let removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModal.checkExist(currentUserId, contactId);
        if(!contactExists){
            return reject(false);
        }

        let removeReq = await ContactModal.removeRequestContact(currentUserId, contactId);

        // remove notification
        await NotificationModal.model.removeRequestNotification(currentUserId, contactId, NotificationModal.types.ADD_CONTACT);

        if(removeReq.n === 1){
            resolve(true);
        }
        reject(false);
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact
}
