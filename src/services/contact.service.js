import _ from "lodash";

import ContactModal from "../models/contact.model";
import UserModal from "../models/user.model";

let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecatedUserIds = [];
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

module.exports = {
    findUsersContact
}
