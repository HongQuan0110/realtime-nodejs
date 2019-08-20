import { validationResult } from "express-validator";

import { contact } from "../services/index";

module.exports.findUsersContact = async (req, res, next) => {
    let errorArr = [];
    let result = validationResult(req);

    if(!result.isEmpty()){
        let errors = Object.values(result.mapped());
        errors.forEach(error => {
            errorArr.push(error.msg);
        })
        // Logging file
        // console.log(errorArr);
        return res.status(500).send(errorArr);
    }

    try {
        let keyword = req.params.keyword;
        let currentUserId = req.user._id;

        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUserAddContact", {users});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
