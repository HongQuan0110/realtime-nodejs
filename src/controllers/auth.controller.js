import { validationResult } from "express-validator";
import { auth } from "../services/index";
import { transError } from "../../lang/en";

module.exports.getLoginRegister = (req, res, next) => {
    return res.render('auth/master', {
        errors: req.flash("errors"),
        success: req.flash("success")
    });
}

module.exports.postRegister = async (req, res, next) => {
    let successArr = [];
    let errorArr = [];
    let result =  validationResult(req);

    if(!result.isEmpty()){
        let errors = Object.values(result.mapped());
        errors.map(val => {
            errorArr.push(val.msg);
        })
        req.flash("errors", errorArr);
        return res.redirect("/login");
    }

    result = await auth.register(req.body.email, req.body.gender, req.body.password);
    if(result === transError.ACCOUNT_IN_USE || result === transError.ACCOUNT_NOT_ACTIVE || result === transError.ACCOUNT_REMOVE){
        errorArr.push(result);
        req.flash("errors", errorArr);
        return res.redirect("/login");
    }
    else{
        successArr.push(result);
        req.flash("success", successArr);
        return res.redirect("/login");
    }
}

module.exports.getLogout = (req, res, next) => {
    // do something
}
