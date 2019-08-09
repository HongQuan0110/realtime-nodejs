import passport from "passport";
import passportGoogle from "passport-google-oauth";

import UserModal from "../../models/user.model";
import { transError, transSuccess } from "../../../lang/en";

let googleStrategy = passportGoogle.OAuth2Strategy;
/**
 * Valid user account type: google
 */

let initPassportGoogle = () => {
    passport.use(new googleStrategy({
        clientID: process.env.GG_APP_ID,
        clientSecret: process.env.GG_APP_SECRET,
        callbackURL: process.env.GG_APP_URL,
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModal.findUserByGoogleUid(profile.id);
            if(user){
                return done(null, user, req.flash("success", transSuccess.LOGIN_SUCCESS(user.username)));
            }

            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {
                    isActive: true
                },
                google:{
                    uid: profile.id,
                    token: accessToken,
                    email: profile.emails[0].value,
                }
            }

            let newUser = await UserModal.createNew(newUserItem);
            return done(null, newUser, req.flash("success", transSuccess.LOGIN_SUCCESS(newUser.username)));
        } catch (error) {
            console.log(error);
            return done(error, null, req.flash("errors", transError.SERVER_ERROR))
        }
    }))

    // Save userId to session
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    })

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
}

module.exports = initPassportGoogle;
