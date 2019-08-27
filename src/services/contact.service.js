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

let removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModal.checkExist(currentUserId, contactId);
        if(!contactExists){
            return reject(false);
        }

        let removeReq = await ContactModal.removeRequestContactSent(currentUserId, contactId);

        if(removeReq.n === 1){
            // remove notification
            await NotificationModal.model.removeRequestContactSentNotification(currentUserId, contactId, NotificationModal.types.ADD_CONTACT);
            resolve(true);
        }
        reject(false);
    })
}

let removeRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModal.checkExist(currentUserId, contactId);
        if(!contactExists){
            console.log(1)
            return reject(false);
        }

        let removeReq = await ContactModal.removeRequestContactReceived(currentUserId, contactId);

        // remove notification - Chức năng này chưa muốn làm
        // await NotificationModal.model.removeRequestContactReceivedNotification(currentUserId, contactId, NotificationModal.types.ADD_CONTACT);

        if(removeReq.n === 1){
            resolve(true);
        }
        reject(false);
    })
}

let approveRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModal.checkExist(currentUserId, contactId);
        if(!contactExists){
            console.log(1)
            return reject(false);
        }

        let approveReq = await ContactModal.approveRequestContactReceived(currentUserId, contactId);

        if(approveReq.nModified === 1){
            // create notification
            let notificationItem = {
                senderId: currentUserId,
                receiverId: contactId,
                type: NotificationModal.types.APPROVE_CONTACT
            }

            await NotificationModal.model.createNew(notificationItem);
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
                    return await UserModal.getNormalUserDataById(contact.userId);
                }
                return await UserModal.getNormalUserDataById(contact.contactId);
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
                return await UserModal.getNormalUserDataById(contact.contactId);
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
                return await UserModal.getNormalUserDataById(contact.userId);
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

/**
 * Read more contacts, max 10 item one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
let readMoreContacts = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await ContactModal.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);
            let users = newContacts.map(async contact => {
                if(currentUserId == contact.contactId){
                    return await UserModal.getNormalUserDataById(contact.userId);
                }
                return await UserModal.getNormalUserDataById(contact.contactId);
            })

            return resolve(Promise.all(users));
        } catch (error) {
            console.log("readMoreContacts:", error);
            reject(error);
        }
    })
}

/**
 * Read more contacts sent, max 10 item one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
let readMoreContactsSent = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await ContactModal.readMoreContactsSent(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);
            let users = newContacts.map(async contact => {
                return await UserModal.getNormalUserDataById(contact.contactId);
            })

            return resolve(Promise.all(users));
        } catch (error) {
            console.log("readMoreContactsSent:", error);
            reject(error);
        }
    })
}

/**
 * Read more contacts received, max 10 item one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
let readMoreContactsReceived = (currentUserId, skipNumberContacts) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await ContactModal.readMoreContactsReceived(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);
            let users = newContacts.map(async contact => {
                return await UserModal.getNormalUserDataById(contact.userId);
            })

            return resolve(Promise.all(users));
        } catch (error) {
            console.log("readMoreContactsReceived:", error);
            reject(error);
        }
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContactSent,
    removeRequestContactReceived,
    approveRequestContactReceived,
    getContacts,
    getContactsSent,
    getContactsReceived,
    countAllContacts,
    countAllContactsSent,
    countAllContactsReceived ,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsReceived
}
