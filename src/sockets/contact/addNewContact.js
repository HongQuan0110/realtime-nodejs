import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "../../helpers/socket.helper";

/**
 * 
 * @param {io} io from socket.io library
 */

let addNewContact = (io) => {
    let clients = {};
    io.on("connection", socket => {
        let currentUserId = socket.request.user._id;

        // push socket Id to array
        // if(clients[currentUserId]){
        //     clients[currentUserId].push(socket.id);
        // }
        // else{
        //     clients[currentUserId] = [socket.id];
        // }
        clients = pushSocketIdToArray(clients, currentUserId, socket);
        
        socket.on("add-new-contact", data => {
            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar
            }

            // emit notification
            if(clients[data.contactId]){
                // clients[data.contactId].forEach(socketId => {
                //     io.sockets.connected[socketId].emit("response-add-new-contact", currentUser);
                // });
                emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);            }
        })

        socket.on("disconnect", function(){
            // remove socket id when disconnect
            // clients[currentUserId] = clients[currentUserId].filter(socketId => socketId !== socket.id);
            // if(!clients[currentUserId].length){
            //     delete clients[currentUserId];
            // }
            clients = removeSocketIdFromArray(clients, currentUserId, socket);
        })
        console.log(clients);
    })
}

module.exports = addNewContact;
