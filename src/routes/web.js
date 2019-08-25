import express from "express";
import passport from "passport";

import { auth, home, user, contact, notification } from "../controllers/index";
import { authValidation, userValidation, contactValidation } from "../validation/index";
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/facebook";
import initPassportGoogle from "../controllers/passportController/google";

// Init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

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

    router.get('/auth/facebook', auth.checkLogOut, passport.authenticate('facebook', {
        scope: ['email']
    }))

    router.get('/auth/facebook/callback', auth.checkLogOut, passport.authenticate('facebook', {
        successRedirect: "/",
        failureRedirect: "/login"
    }))

    router.get('/auth/google', auth.checkLogOut, passport.authenticate('google', {
        scope: ['email']
    }))

    router.get('/auth/google/callback', auth.checkLogOut, passport.authenticate('google', {
        successRedirect: "/",
        failureRedirect: "/login"
    }))

    router.get('/logout', auth.checkLoggedIn, auth.getLogout);

    router.put('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar);

    router.put('/user/update-info', auth.checkLoggedIn, userValidation.updateInfo, user.updateInfo);

    router.put('/user/update-password', auth.checkLoggedIn, userValidation.updatePassword, user.updatePassword);

    router.get('/contact/find-users/:keyword', auth.checkLoggedIn, contactValidation.findUsersContact,  contact.findUsersContact);

    router.post('/contact/add-new', auth.checkLoggedIn, contact.addNew);

    router.delete('/contact/remove-request-contact', auth.checkLoggedIn, contact.removeRequestContact);

    router.get('/notification/read-more', auth.checkLoggedIn, notification.readMore);

    app.use('/', router);
}

module.exports = initRoutes;
