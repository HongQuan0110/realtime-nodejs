import UserModal from "../models/user.model";

/**
 * Update userInfo
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id, item) => {
    return UserModal.updateUserById(id, item);
}

module.exports = {
    updateUser
}
