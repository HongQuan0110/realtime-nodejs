export const pushSocketIdToArray = (clients, userId, socket) => {
    if(clients[userId]){
        clients[userId].push(socket.id);
    }
    else{
        clients[userId] = [socket.id];
    }
    return clients;
}

export const emitNotifyToArray = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketId => {
        io.sockets.connected[socketId].emit(eventName, data);
    });
}

export const removeSocketIdFromArray = (clients, userId, socket) => {
    clients[userId] = clients[userId].filter(socketId => socketId !== socket.id);
    if(!clients[userId].length){
        delete clients[userId];
    }
    return clients;
}
