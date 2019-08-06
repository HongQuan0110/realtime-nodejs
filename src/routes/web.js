import express from "express";
import passport from "passport";
import { auth, home } from "../controllers/index";
import { authValidation } from "../validation/index";
import initPassportLocal from "../controllers/passportController/local";

// Init all passport
initPassportLocal();

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

    router.post('/login', passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }))

    app.use('/', router);
}

module.exports = initRoutes;
