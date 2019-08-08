import passport from "passport";
import passportFacebook from "passport-facebook";

import UserModal from "../../models/user.model";
import { transError, transSuccess } from "../../../lang/en";

let facebookStrategy = passportFacebook.Strategy;
/**
 * Valid user account type: facebook
 */

let initPassportFacebook = () => {
    passport.use(new facebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: process.env.FB_APP_URL,
        profileFields: ["email", "gender", "displayName"],
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModal.findUserByFacebookUid(profile.id);
            if(user){
                return done(null, user, req.flash("success", transSuccess.LOGIN_SUCCESS(user.username)));
            }

            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {
                    isActive: true
                },
                facebook: {
                    uid: profile.id,
                    token: accessToken,
                    email: profile.emails[0].value
                }
            }

            let newUser = await UserModal.createNew(newUserItem);
            return done(null, newUser, req.flash("success", transSuccess.LOGIN_SUCCESS(newUser.username)));
        } catch (error) {
            console.log(error);
            return done(null, false, req.flash("errors", transError.SERVER_ERROR));
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

module.exports = initPassportFacebook;
