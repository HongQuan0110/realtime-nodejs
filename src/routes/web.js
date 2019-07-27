import express from "express";
import { auth, home } from "../controllers/index";

const router = express.Router();

/**
 * Init all routes
 * @param app from exactly express
 */

const initRoutes = (app) => {
    router.get('/', home.getHome)
    
    router.get('/login', auth.getLoginRegister)

    app.use('/', router);
}

module.exports = initRoutes;
