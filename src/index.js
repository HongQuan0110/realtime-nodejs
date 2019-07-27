import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
import ViewEngine from "./config/viewEngine";
import InitRoutes from "./routes/web";

// Init app
let app = express();

// Connect to mongoDB
ConnectDB();

// config view engine
ViewEngine(app);

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
