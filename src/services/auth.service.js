import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4"
import UserModal from "../models/user.model";
import { transError, transSuccess, transMail } from "../../lang/en";
import sendMail from "../config/mailer";

const saltRounds = 7;

let salt = bcrypt.genSaltSync(saltRounds);

let register = async (email, gender, password, protocol, host) => {

    let userByEmail = await UserModal.findByEmail(email);

    if(userByEmail){
        if(userByEmail.deletedAt){
            return transError.ACCOUNT_REMOVE;
        }
        if(!userByEmail.local.isActive){
            return transError.ACCOUNT_NOT_ACTIVE;
        }
        return transError.ACCOUNT_IN_USE;
    }

    let userItem = {
        username: email.split("@")[0],
        gender,
        local: {
            email,
            password: bcrypt.hashSync(password, salt),
            verifyToken: uuidv4()
        }
    }

    let user = await UserModal.createNew(userItem);
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`
    return sendMail(email, transMail.SUBJECT, transMail.TEMPLATE(linkVerify))
        .then(success => {
            console.log(success);
            
            return transSuccess.USER_CREATED(user.local.email);
        })
        .catch(async err => {
            // Remove user
            console.log(err);
            
            await UserModal.removeUserById(user._id);
            return transMail.SEND_FAILED;
        })
}

let verifyToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await UserModal.verifyToken(token);
            if(!user){
                return reject(transError.TOKEN_UNDEFINED);
            }
            
            resolve(transSuccess.ACCOUNT_ACTIVE);
        } catch (error) {
            reject(transError.TOKEN_UNDEFINED);
        }
    }) 
}

module.exports = {
    register,
    verifyToken
}
