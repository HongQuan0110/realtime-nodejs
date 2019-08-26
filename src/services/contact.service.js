import _ from "lodash";

import ContactModal from "../models/contact.model";
import UserModal from "../models/user.model";
import NotificationModal from "../models/notification.model";

const LIMIT_NUMBER_TAKEN = 1;

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

let getContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModal.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async contact => {
                if(currentUserId == contact.contactId){
                    return await UserModal.findUserById(contact.userId);
                }
                return await UserModal.findUserById(contact.contactId);
            })

            return resolve(Promise.all(users));
        } catch (error) {
            console.log("Error getContacts service:", error);
            reject(error);
        }
    })
}

let getContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModal.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async contact => {
                return await UserModal.findUserById(contact.contactId);
            })

            return resolve(Promise.all(users));
        } catch (error) {
            console.log("Error getContactsSent service:", error);
            reject(error);
        }
    })
}

let getContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModal.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async contact => {
                return await UserModal.findUserById(contact.userId);
            })

            return resolve(Promise.all(users));
        } catch (error) {
            console.log("Error getContactsReceived service:", error);
            reject(error);
        }
    })
}

let countAllContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModal.countAllContacts(currentUserId);
            resolve(count);
        } catch (error) {
            console.log("Error count all contacts:", error);
            reject(error);
        }
    })
}

let countAllContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModal.countAllContactsSent(currentUserId);
            resolve(count);
        } catch (error) {
            console.log("Error count contacts sent:", error);
            reject(error);
        }
    })
}

let countAllContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModal.countAllContactsReceived(currentUserId);
            resolve(count);
        } catch (error) {
            console.log("Error count contacts received:", error);
            reject(error);
        }
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact,
    getContacts,
    getContactsSent,
    getContactsReceived,
    countAllContacts,
    countAllContactsSent,
    countAllContactsReceived 
}
