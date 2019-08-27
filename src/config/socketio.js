import passportSocketio from "passport.socketio";
// import cookieParser from "cookie-parser";

// import config from "../config/session";

let configSocketIo = (io, cookieParser, sessionStore) => {
    io.use(passportSocketio.authorize({
        cookieParser: cookieParser,
        key: process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        success: (data, accept) => {
            console.log('successful connection to socket.io');
            if(data.user.logged_in){
                accept("Invalid user", false);
            }
            accept(null, true);
        },
        fail: (data, message, error, accept) => {
            if(error){
                console.log('failed connection to socket.io:', message);
                accept(new Error(message), false);
            }
        }
    }))
}

module.exports = configSocketIo;
