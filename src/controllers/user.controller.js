import multer from "multer";
import uuidv4 from "uuid/v4"
import fsExtra from "fs-extra";

import { transError, transSuccess } from "../../lang/en";
import { app } from "../config/app";
import { user } from "../services/index";

let storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory);
    },
    filename: (req, file, callback) => {
        let match = app.avatar_type;
        if(match.indexOf(file.mimetype) === -1){
            return callback(transError.AVATAR_TYPE, null);
        }

        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatarName);
    }
})

let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: {fileSize: app.avatar_limit_size}
}).single("avatar");

module.exports.updateAvatar = (req, res, next) => {
    avatarUploadFile(req, res, async (err) => {
        if(err){
            if(err.message){
                return res.status(500).send(transError.AVATAR_SIZE);
            }
            return res.status(500).send(err);
        }
        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now()
            }
            let userUpdate = await user.updateUser(req.user._id, updateUserItem);

            // Remove old user avatar
            if(userUpdate.avatar !== app.avatar_origin){
                await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`)
            }

            let result = {
                message: transSuccess.AVATAR_UPDATED,
                imageSrc: `/images/users/${req.file.filename}`
            }

            return res.status(200).send(result);
        } catch (error) {
            console.log('updaload file:', error);
            return res.status(500).send(error);
        }
    })
}
