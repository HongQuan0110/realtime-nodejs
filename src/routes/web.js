import express from "express";
import passport from "passport";
import { auth, home } from "../controllers/index";
import { authValidation } from "../validation/index";
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/facebook";

// Init all passport
initPassportLocal();
initPassportFacebook();

const router = express.Router();

/**
 * Init all routes
 * @param app from exactly express
 */

const initRoutes = (app) => {
    router.get('/', auth.checkLoggedIn, home.getHome);
    
    router.post('/register', auth.checkLogOut, authValidation.register, auth.postRegister);

    router.get('/verify/:token', auth.checkLogOut, auth.verifyToken);

    router.get('/login', auth.checkLogOut, auth.getLoginRegister);

    router.post('/login', auth.checkLogOut, passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }))

    router.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }))

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: "/",
        failureRedirect: "/login"
    }))

    router.get('/logout', auth.checkLoggedIn, auth.getLogout);

    app.use('/', router);
}

module.exports = initRoutes;
