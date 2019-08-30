import _ from "lodash";

import ContactModal from "../models/contact.model";
import UserModal from "../models/user.model";
import ChatGroupModal from "../models/chatGroup.model";
import MessageModal from "../models/message.model";

const LIMIT_CONVERSATION_TAKEN = 10;
const LIMIT_MESSAGE_TAKEN = 10;

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

            // get message to apply in screen chat
            let allConversationWithMessagesPromise = allConversations.map(async conversation => {
                let getMessages = await MessageModal.model.getMessages(currentUserId, conversation._id, LIMIT_MESSAGE_TAKEN);
                conversation = conversation.toObject();
                // console.log(getMessages)
                conversation.messages = getMessages.reverse();
                return conversation;
            })

            let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
            // sort by updated desending
            // allConversationWithMessages = _.sortBy(allConversationWithMessages, item => {
            //     return -item.updatedAt
            // })
            resolve({
                allConversationWithMessages
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
