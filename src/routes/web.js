import express from "express";
import { auth, home } from "../controllers/index";
import { authValidation } from "../validation/index";

const router = express.Router();

/**
 * Init all routes
 * @param app from exactly express
 */

const initRoutes = (app) => {
    router.get('/', home.getHome);
    
    router.post('/register', authValidation.register, auth.postRegister);

    router.get('/verify/:token', auth.verifyToken);

    router.get('/login', auth.getLoginRegister);

    app.use('/', router);
}

module.exports = initRoutes;
