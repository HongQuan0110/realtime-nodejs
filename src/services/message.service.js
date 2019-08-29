import _ from "lodash";

import ContactModal from "../models/contact.model";
import UserModal from "../models/user.model";
import ChatGroupModal from "../models/chatGroup.model";

const LIMIT_CONVERSATION_TAKEN = 10;

let getAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModal.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);
            let userContacts = contacts.map(async contact => {
                
                if(currentUserId == contact.contactId){
                    let getUserContact = await UserModal.getNormalUserDataById(contact.userId);
                    // getUserContact = getUserContact.toObject();
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
                let getUserContact = await UserModal.getNormalUserDataById(contact.contactId);
                getUserContact.updatedAt = contact.updatedAt;
                return getUserContact;
            })

            let userConservation = await Promise.all(userContacts);
            let groupConversation = await ChatGroupModal.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN);
            
            let allConversations = userConservation.concat(groupConversation);
            allConversations = _.sortBy(allConversations, function(item){
                return -item.updatedAt;
            })

            resolve({
                userConservation,
                groupConversation,
                allConversations
            })
        } catch (error) {
            console.log("getAllConversationItems:", error);
            reject(error);
        }
    })
}

module.exports = {
    getAllConversationItems
}
