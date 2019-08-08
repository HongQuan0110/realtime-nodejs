import passport from "passport";
import passportLocal from "passport-local";

import UserModal from "../../models/user.model";
import { transError, transSuccess } from "../../../lang/en";

let LocalStrategy = passportLocal.Strategy;
/**
 * Valid user account type: local
 */

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            let user = await UserModal.findByEmail(email);
            if(!user){
                return done(null, false, req.flash("errors", transError.LOGIN_FAILED));
            }
            if(!user.local.isActive){
                return done(null, false, req.flash("errors", transError.ACCOUNT_NOT_ACTIVE));
            }

            let checkPassword = await user.comparePassword(req.body.password);
            if(!checkPassword){
                return done(null, false, req.flash("errors", transError.LOGIN_FAILED));
            }

            return done(null, user, req.flash("success", transSuccess.LOGIN_SUCCESS(user.username)));
        } catch (error) {
            console.log(error);
            return done(null, false, req.flash("errors", transError.SERVER_ERROR));
        }
    }));

    // Save userId to session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // This is called by passport.session()
    // return userinfo to req.user
    passport.deserializeUser((id, done) => {
        UserModal.findUserById(id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err, null);
        })
    })
};

module.exports = initPassportLocal;
