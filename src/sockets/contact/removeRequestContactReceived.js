import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "../../helpers/socket.helper";

/**
 * 
 * @param {io} io from socket.io library
 */

let removeRequestContactReceived = (io) => {
    let clients = {};
    io.on("connection", function(socket){
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket);

        socket.on("remove-request-contact-received", data => {
            let currentUser = {
                id: socket.request.user._id
            }

            if(clients[data.contactId]){
                emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact-received", currentUser);
            }
        })

        socket.on("disconnect", function(){
            // remove socket id when disconnect
            clients = removeSocketIdFromArray(clients, currentUserId, socket);
        })
    })
}

module.exports = removeRequestContactReceived;
