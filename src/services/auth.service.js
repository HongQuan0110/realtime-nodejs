import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4"
import UserModal from "../models/user.model";
import { transError, transSuccess } from "../../lang/en";

const saltRounds = 7;

let salt = bcrypt.genSaltSync(saltRounds);

let register = async (email, gender, password) => {

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
    return transSuccess.USER_CREATED(user.local.email);
}

module.exports = {
    register
}
