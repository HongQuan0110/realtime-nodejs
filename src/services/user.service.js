import UserModal from "../models/user.model";
import bcrypt from "bcrypt";

import { transError } from "../../lang/en";

const saltRound = 7;
const salt = bcrypt.genSaltSync(saltRound);

/**
 * Update userInfo
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id, item) => {
    return UserModal.updateUserById(id, item);
}

/**
 * Update password for user
 * @param {userId} id 
 * @param {data update} item 
 */
let updatePassword = (id, item) => {
    return new Promise(async (resolve, reject) => {
        let currentUser = await UserModal.findUserById(id);
        if(!currentUser){
            return reject(transError.ACCOUNT_UNDEFINED);
        }

        let checkCurrentPassword = await currentUser.comparePassword(item.currentPassword);
        if(!checkCurrentPassword){
            return reject(transError.USER_CURRENT_PASSWORD_FAILED);
        }

        const hash = bcrypt.hashSync(item.newPassword, salt);
        await UserModal.updatePasswordById(id, hash); 
        resolve(true);
    })
}

module.exports = {
    updateUser,
    updatePassword
}
