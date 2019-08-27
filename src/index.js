import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
import InitRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import https from "https";
import pem from "pem";

// Init app
let app = express();

// Connect to mongoDB
ConnectDB();

// Enable post data for request
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Enable flash messages
app.use(connectFlash())

// Use Cookie Parser
app.use(cookieParser())

// config view engine
configViewEngine(app);

// config session
session.config(app);

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
InitRoutes(app);

app.get('/test-db', async (req, res, next) => {
    try {
        let item = {
            userId: "123123123",
            contactId: "456456456"
        }
        let contact = await ContactModel.createNew(item)
        res.send(contact);
    } catch (error) {
        console.log(error);
    }
})

let server = app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log('Server listening on port: ', process.env.APP_PORT);
})

let io = socketio(server);
configSocketIo(io, cookieParser, session.sessionStore);
initSockets(io);

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err
//     }
//     // Init app
//     let app = express();

//     // Connect to mongoDB
//     ConnectDB();

//     // Enable post data for request
//     // parse application/x-www-form-urlencoded
//     app.use(bodyParser.urlencoded({ extended: true }))

//     // parse application/json
//     app.use(bodyParser.json())

//     // Enable flash messages
//     app.use(connectFlash())

//     // config view engine
//     configViewEngine(app);

//     // config session
//     configSession(app);

//     // Config passport js
//     app.use(passport.initialize());
//     app.use(passport.session());

//     // Init all routes
//     InitRoutes(app);

//     app.get('/test-db', async (req, res, next) => {
//         try {
//             let item = {
//                 userId: "123123123",
//                 contactId: "456456456"
//             }
//             let contact = await ContactModel.createNew(item)
//             res.send(contact);
//         } catch (error) {
//             console.log(error);
//         }
//     })
   
//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//         console.log('Server listening on port: ', process.env.APP_PORT);
//     })
// })
