import _ from "lodash";

import ContactModal from "../models/contact.model";
import UserModal from "../models/user.model";

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
            reject(false);
        }

        let contactItem = {
            userId: currentUserId,
            contactId,
        }

        let newContact = await ContactModal.createNew(contactItem);
        resolve(newContact);
    })
}

let removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModal.checkExist(currentUserId, contactId);
        if(!contactExists){
            reject(false);
        }

        let removeReq = await ContactModal.removeRequestContact(currentUserId, contactId);
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
