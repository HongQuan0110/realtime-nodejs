import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
import configViewEngine from "./config/viewEngine";
import InitRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";

// Init app
let app = express();

// Connect to mongoDB
ConnectDB();

// Enable post data for request
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Enable flash messages
app.use(connectFlash())

// config view engine
configViewEngine(app);

// config session
configSession(app);

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

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log('Server listening on port: ', process.env.APP_PORT);
})
