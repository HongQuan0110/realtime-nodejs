import express from "express";
import { auth, home } from "../controllers/index";

const router = express.Router();

/**
 * Init all routes
 * @param app from exactly express
 */

const initRoutes = (app) => {
    router.get('/', auth.getLoginRegister)
    
    router.get('/login', home.getHome)

    app.use('/', router);
}

module.exports = initRoutes;
