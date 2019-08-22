/**
 * 
 * @param {io} io from socket.io library
 */

let addNewContact = (io) => {
    io.on("connection", socket => {
        console.log(socket.id)
        socket.on("add-new-contact", data => {
            console.log(data);
            console.log(socket)
        })
    })
}

module.exports = addNewContact;
